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
