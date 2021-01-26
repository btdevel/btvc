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






# http://bardstale.brotherhood.de/talefiles/forum/viewtopic.php?f=17&t=910&p=3443#p3443
# # 000 - 001	Load Address of file
# 002 - 201	Wall Map, one byte per cell (see below),
#             lines are encoded south to north, west to east
# 202 - 401	Event Map, one byte per cell (see below),
#             lines are encoded south to north, west to east
# 402 - 409	Level flags, relate to NMAx file (8 levels)
# 40a - 411	Lock flags, teleport protected level FF, free level 00
# 412		   monster level for random encounters
# 413		   PHDO lock, 01 = PHDO locked, disabled
# 414		   wall set style: 0 = sewer, 1 = Cellar, 2 = catacomb, 3 = Mangar
# 415 - 416	point of return into Skara Brae map
# 417		   dungeon direction, 00 = cellars, 03 = towers
# 418 - 421   dungeon name (9 chars and dc)
# 422 - 431	coordinates for up to 8 special events
# 		      loaded from files (8 coors)
# 432 - 441	indices into file load table to evaluate file
# 		      number to be loaded from there (see below)
# 442 - 461	anti magic (16 coors)
# 462 - 471	teleport FROM coors (8 coors)
# 472 - 481	teleport TO coors (8 coors)
# 482 - 491	Spinners (8 coors)
# 492 - 4a1	Smoke (8 coors)
# 4a2 - 4c1	HP damage zone (16 coors)
# 4c2 - 4d1	SP regeneration zone (8 coors)
# 4d2 - 4e1	Stasis chambers (8 coors)
# 4e2 - 4f1	cells with messages, same sequence as following texts (8 coors)
# 4f2 - 501	forced encounters, inavoidable fights (8 coors)
# 502 - 511	type and number of opps from 4f2
# 512 - 521	text offset, low/high byte, in file text starts actually
# 		      when you substract -FD20 (8 pairs)
# 522 - eof	texts
# _______________________________________________________

# 002 - 201 Wall Map, one byte per cell (see below)

# each byte represent 1 cell. The bits 0 and 1 for the north side,
# bits 2 and 3 for the south side, bits 4 and 5 east and bits
# 6 and 7 west.

# 00 = no walls
# 01 = wall
# 10 = door
# 11 = secret door
# _______________________________________________________

# 202 - 401 Event flags

# bit 0 	set if there are stairs to previous level, depending on 417 up or down
# bit 1 	set if there are stairs to next level, depending on 417 up or down
# bit 2 	set if there is a special
# bit 3 	set if there's darkness
# bit 4 	set if there's a trap.
# bit 5 	set if there's a portal down
# bit 6 	set if there's a portal up
# bit 7 	set if there's a random encounter scheduled for this tile.
