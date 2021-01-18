#!/usr/bin/python2

import os, sys
import json
import bt.extract.btfile as btfile
from level_map_extra import make_map, addEvents

def load_c64enc():
    data = btfile.load_file("MEMDUMP.BIN", msdos_bt1_path)
    start=0x000c4742
    c64enc=data[start:start+256]
    c64enc[0]="\n"
    return c64enc

def c64decode(buf):
    return "".join(chr(c64enc[c]) for c in buf)

def make_tuples(l):
    return [(l[i], l[i+1]) for i in range(0,len(l),2) if l[i]!=255]

# def make_coords(l):
#     return [{'x': l[i+1], 'y': l[i]} for i in range(0,len(l),2) if l[i]!=255]
def make_coords(l):
    return [[l[i+1], l[i]] for i in range(0,len(l),2) if l[i]!=255]

def make_list(l):
    return [x for x in l if x!=255]



class Level(object): pass

def parse_level(lev_data):

    wall_sets = {0: "Sewers", 1: "Cellar", 2: "Catacombs", 3: "Mangar"}
    level = Level()
    wallMap = lev_data[0x0000:0x0200] # keep raw
    eventMap = lev_data[0x0200:0x0400] # keep raw
    level.map = make_map(wallMap)

    nmax = lev_data[0x0400:0x0408] # level indicator
    apar = lev_data[0x0408:0x0410] # aport arcane
    level.levelTeleport = zip(make_list(nmax),
                               [not bool(b) for b in apar])

    level.monsterDifficulty = lev_data[0x0410]
    level.phaseDoor = not bool(lev_data[0x0411])
    level.wallStyle = wall_sets[lev_data[0x0412]]
    level.cityExitPosition = make_coords(lev_data[0x0413:0x0415])[0] if lev_data[0x413]!=255 else []
    level.goesDown = not bool(lev_data[0x0415])
    level.shortName = c64decode(lev_data[0x0416:0x0420]).translate(None, '\\').strip()

    spec_coord = make_coords(list(lev_data[0x0420:0x0430]))
    spec_prog = make_tuples(list(lev_data[0x0430:0x0440]))
    level.specialPrograms = zip(spec_coord, spec_prog)

    level.antimagicZones = make_coords(list(lev_data[0x0440:0x0460]))

    telefrom_coord = make_coords(list(lev_data[0x0460:0x0470]))
    teleto_coord = make_coords(list(lev_data[0x0470:0x0480]))
    level.teleports = zip(telefrom_coord, teleto_coord)

    level.spinners = make_coords(list(lev_data[0x0480:0x0490]))

    level.smokeZones = make_coords(list(lev_data[0x0490:0x04A0]))
    level.hitpointDamage = make_coords(list(lev_data[0x04A0:0x04C0]))
    level.spellpointRestore = make_coords(list(lev_data[0x04C0:0x04D0]))
    level.stasisChambers = make_coords(list(lev_data[0x04D0:0x04E0]))

    msg_coord = make_coords(list(lev_data[0x04E0:0x04F0]))

    encounter_coord = make_coords(list(lev_data[0x04F0:0x0500]))
    encounter_num_type = make_tuples(lev_data[0x0500:0x0510])
    level.encounters = zip(encounter_coord, encounter_num_type)

    text_offset = list(lev_data[0x0510:0x0520])
    texts = c64decode(lev_data[0x0520:]).split("\\")
    level.messages=zip(msg_coord, texts)

    addEvents(level, eventMap)
    return level

def level_as_json(levnum):
    class LevelEncoder(json.JSONEncoder):
         def default(self, obj):
             if isinstance(obj, Level):
                 return obj.__dict__
             if isinstance(obj, bytearray):
                 return [a for a in obj]
             # Let the base class default method raise the TypeError
             return json.JSONEncoder.default(self, obj)

    level = parse_level(data[levnum])
    print(json.dumps(level, sort_keys=True, indent=4, cls=LevelEncoder))


res_path = os.path.join("..", "res")
msdos_bt1_path = os.path.join(res_path, "msdos", "bt1")
data = btfile.load_indexed_file("levs", msdos_bt1_path)

c64enc = load_c64enc()
if len(sys.argv)>=2:
    levnum=int(sys.argv[1])
else:
    levnum=0

level_as_json(levnum)
