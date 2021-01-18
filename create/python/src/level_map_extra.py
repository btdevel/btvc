def make_map(wallMap):
    cell = [bytearray('###'),  bytearray('# #'), bytearray('###')]
    cell = [bytearray('+-+'),  bytearray('| |'), bytearray('+-+')]
    import copy
    cells = [[copy.deepcopy(cell) for i in range(22)] for j in range(22)]

    for i in range(22):
        for j in range(22):
            walls = wallMap[j+(21-i)*22]
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

            if i == 0 or i == 21:
                cells[21 - i][j][1][1] = str(j % 10)
            if not(i == 0 or i == 21):
                if j == 0 or j == 21:
                    cells[21 - i][j][1][1] = str(i % 10)

    s = []
    for row in cells:
        s.append("".join([str(col[0]) for col in row]))
        s.append("".join([str(col[1]) for col in row]))
        s.append("".join([str(col[2]) for col in row]))
    return s

def addEvents(level, eventMap):
    level.stairsPrevious = []
    level.stairsNext = []
    level.specialsOther = []
    level.darkness = []
    level.traps = []
    level.portalDown = []
    level.portalUp = []
    level.randomEncounter = []

    fields = [
        level.stairsPrevious,
        level.stairsNext,
        level.specialsOther,
        level.darkness,
        level.traps,
        level.portalDown,
        level.portalUp,
        level.randomEncounter
        ]

    for i in xrange(22):
        for j in xrange(22):
            for b, f in enumerate(fields):
                if eventMap[j+(21-i)*22] & (1<<b):
                    f.append((j, 21 - i))
