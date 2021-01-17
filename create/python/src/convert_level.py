#!/usr/bin/python2

import os, sys

import bt.extract.btfile as btfile
import json

res_path = os.path.join("..", "res")
msdos_bt1_path = os.path.join(res_path, "msdos", "bt1")
#btfile.show_indexed_file_info("levs", msdos_bt1_path)
data = btfile.load_indexed_file("levs", msdos_bt1_path)

if len(sys.argv)>=2:
    levnum=int(sys.argv[1])
else:
    levnum=0


def load_c64enc():
    data = btfile.load_file("MEMDUMP.BIN", msdos_bt1_path)
    start=0x000c4742
    c64enc=data[start:start+256]
    c64enc[0]="\n"
    return c64enc

c64enc = load_c64enc()
def c64decode(buf):
    return "".join(chr(c64enc[c]) for c in buf)

def make_tuples(l):
    return [(l[i], l[i+1]) for i in range(0,len(l),2) if l[i]!=255]

def make_list(l):
    return [x for x in l if x!=255]


class Level(object): pass

def parse_level(lev_data):

    wall_sets = {0: "Sewers", 1: "Cellar", 2: "Catacombs", 3: "Mangar"}
    level = Level()
    #print lev_data
    #return 0
    level.wall_data = lev_data[0x0000:0x0200]
    level.spec_data = lev_data[0x0200:0x0400]
    level.nmax = lev_data[0x0400:0x0408]
    level.apar = lev_data[0x0408:0x0410]
    level.level_teleport = zip(make_list(level.nmax), 
                               [not bool(b) for b in level.apar])
    level.monster_difficulty = lev_data[0x0410]
    level.phase_door = not bool(lev_data[0x0411])
    level.wall_style = wall_sets[lev_data[0x0412]]
    level.entry_position = tuple(lev_data[0x0413:0x0415])
    level.goes_down = not bool(lev_data[0x0415])
    level.dungeon_name = c64decode(lev_data[0x0416:0x0420]).translate(None, '\\').strip()
    level.spec_coord = make_tuples(list(lev_data[0x0420:0x0430]))
    level.spec_prog = make_tuples(list(lev_data[0x0430:0x0440]))
    level.specials = zip(level.spec_coord, level.spec_prog)

    level.antimagic_zones = make_tuples(list(lev_data[0x0440:0x0460]))
    level.telefrom_coord = make_tuples(list(lev_data[0x0460:0x0470]))
    level.teleto_coord = make_tuples(list(lev_data[0x0470:0x0480]))
    level.teleports = zip(level.telefrom_coord, level.teleto_coord)
    level.spinners = make_tuples(list(lev_data[0x0480:0x0490]))
    level.smoke_zones = make_tuples(list(lev_data[0x0490:0x04A0]))
    level.hitpoint_damage = make_tuples(list(lev_data[0x04A0:0x04C0]))
    level.spellpoint_restore = make_tuples(list(lev_data[0x04C0:0x04D0]))
    level.stasis_chambers = make_tuples(list(lev_data[0x04D0:0x04E0]))
    msg_coord = make_tuples(list(lev_data[0x04E0:0x04F0]))
    level.encounter_coord = make_tuples(list(lev_data[0x04F0:0x0500]))
    level.encounter_num_type = make_tuples(lev_data[0x0500:0x0510])
    level.encounters = zip(level.encounter_coord, level.encounter_num_type)

    text_offset = list(lev_data[0x0510:0x0520])
    texts = c64decode(lev_data[0x0520:]).split("\\")
    level.messages = zip(msg_coord, texts)


    return level

def repr_level(levnum, level):

    def printer(field, compact=1):
        print "%s =" % field,
        value = getattr(level, field)
        if (not isinstance(value, list) or
            (len(value)==0) or
            (len(value)==1 and compact>0) or compact>1):
            print "%r" % (value,)
        else:
            print "["
            for v in value:
                print "    %r," % (v,)
            print "    ]"

    print "level_number = %r" % levnum

    # for i in xrange(22):
    #     for j in xrange(22):
    #         print "%02x" % level.wall_data[j+(21-i)*22], 
    #     print
    # print

    level.stairs_previous = []
    level.stairs_next = []
    level.specials_other = []
    level.darkness = []
    level.traps = []
    level.portal_down = []
    level.portal_up = []
    level.random_encounter = []

    fields = [
        level.stairs_previous,
        level.stairs_next,
        level.specials_other,
        level.darkness,
        level.traps,
        level.portal_down,
        level.portal_up,
        level.random_encounter
        ]

    for i in xrange(22):
        for j in xrange(22):
            for b, f in enumerate(fields):
                if level.spec_data[j+(21-i)*22] & (1<<b): 
                    f.append((i, j))

        

    printer("dungeon_name")
    printer("wall_style")
    printer("monster_difficulty")
    printer("goes_down")
    printer("entry_position" )
    print

    printer("phase_door")
    printer("level_teleport")
    print 

    printer("stairs_previous", compact=2)
    printer("stairs_next", compact=2)
    printer("portal_down", compact=2)
    printer("portal_up", compact=2)
    print

    printer("teleports", compact=0)
    printer("encounters", compact=0)
    printer("messages", compact=0)
    printer("specials")
    print

    printer("smoke_zones", compact=2)
    printer("darkness", compact=2)
    printer("antimagic_zones", compact=2)
    printer("spinners", compact=2)
    printer("traps", compact=2)
    printer("hitpoint_damage", compact=2)
    printer("spellpoint_restore", compact=2)
    printer("stasis_chambers", compact=2)
    printer("random_encounter", compact=2)
    printer("specials_other", compact=2)
    print



def print_level(levnum, level):
    print levnum
    print

    for i in xrange(22):
        for j in xrange(22):
            print "%02x" % level.wall_data[j+(21-i)*22], 
        print
    print

    for i in xrange(22):
        for j in xrange(22):
            print "%02x" % level.spec_data[j+(21-i)*22], 
        print
    print

    print "nmax:", ["%02X" % d for d in level.nmax]
    print "apar:", ["%02X" % d for d in level.apar]
    print "monster_difficulty:", level.monster_difficulty
    print "phase_door:", level.phase_door
    print "wall_style:", level.wall_style
    print "entry_position:", level.entry_position
    print "goes_down:", level.goes_down
    print "dungeon_name:", level.dungeon_name
    print "spec_coord:", level.spec_coord
    print "spec_prog:", level.spec_prog
    print "antimagic_zones:", level.antimagic_zones
    print "telefrom_coord:", level.telefrom_coord
    print "teleto_coord:", level.teleto_coord
    print "teleports:", level.teleports
    print "spinners:", level.spinners
    print "smoke_zones:", level.smoke_zones
    print "hitpoint_damage:", level.hitpoint_damage
    print "spellpoint_restore:", level.spellpoint_restore
    print "stasis_chambers:", level.stasis_chambers
    print "msg_coord:", level.msg_coord
    print "encounter_coord:", level.encounter_coord
    print "encounter_num_type:", level.encounter_num_type
    print "text_offset:", level.text_offset

    for i, text in enumerate(level.texts):
        if i>=len(level.msg_coord):
            break
        print "text", i, ":", text




def make_map(level):
    cell = [bytearray('###'),  bytearray('# #'), bytearray('###')]
    cell = [bytearray('+-+'),  bytearray('| |'), bytearray('+-+')]
    import copy
    cells = [[copy.deepcopy(cell) for i in range(22)] for j in range(22)]

    for i in range(22):
        for j in range(22):
            walls = level.wall_data[j+(21-i)*22]
            north = (walls & 0b00000011) >> 0
            south = (walls & 0b00001100) >> 2
            east  = (walls & 0b00110000) >> 4
            west  = (walls & 0b11000000) >> 6

            void = 0b00
            wall = 0b01
            door = 0b10
            secr = 0b11
            chars = ' -DS'
            cells[i][j][0][1] = chars[north]
            cells[i][j][2][1] = chars[south]
            if north == void:
                cells[i][j][0][0] = '|'
                cells[i][j][0][2] = '|'
            if south == void:
                cells[i][j][2][0] = '|'
                cells[i][j][2][2] = '|'
                
            chars = ' |DS'
            cells[i][j][1][0] = chars[west]
            cells[i][j][1][2] = chars[east]
            if west == void:
                if cells[i][j][0][0] == ord('+'):
                    cells[i][j][0][0] = '-'
                else:
                    cells[i][j][0][0] = '.'
                if cells[i][j][2][0] == ord('+'):
                    cells[i][j][2][0] = '-'
                else:
                    cells[i][j][2][0] = '.'
            if east == void:
                if cells[i][j][0][2] == ord('+'):
                    cells[i][j][0][2] = '-'
                else:
                    cells[i][j][0][2] = '.'
                if cells[i][j][2][2] == ord('+'):
                    cells[i][j][2][2] = '-'
                else:
                    cells[i][j][2][2] = '.'

    s = []
    for row in cells:
        s.append("".join([str(col[0]) for col in row]))
        s.append("".join([str(col[1]) for col in row]))
        s.append("".join([str(col[2]) for col in row]))
    return s

def add_map_info(level, map):
    for x, y in level.traps:
        i = x * 3 + 1
        j = y * 3 + 1
        map[i] = map[i][:j] + 'T' + map[i][j+1:]
    for x, y in level.spinners:
        i = x * 3 + 1
        j = y * 3 + 1
        map[i] = map[i][:j] + 'O' + map[i][j+1:]
    for x, y in level.darkness:
        i = x * 3 + 1
        j = y * 3 + 1
        map[i] = map[i][:j] + '#' + map[i][j+1:]

            
def level_as_python(levnum):
    print "#" * 80
    level = parse_level(data[levnum])
    repr_level(levnum, level)

    map = make_map(level)
    print "map = ["
    for s in map:
        print "    %r," % s
    print "    ]"

    print


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
    print(json.dumps(level, sort_keys=False, indent=4, cls=LevelEncoder))

#level_as_python(levnum)
level_as_json(levnum)
