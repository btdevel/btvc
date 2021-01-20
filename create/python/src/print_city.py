import os
# Example 8c: Make a passage from Main to Trumpet (opposite the shoppe)
import bt.extract.btfile as btfile


res_path = os.path.join("..", "res")
msdos_bt1_path = os.path.join(res_path, "msdos", "bt1")

transH = {
    0: " ",  # Street
    1: "1", 2: "2", 3: "3", 4: "4",  # Houses
    0x0B: "A",  # Adventurer's Guild
    0x12: "P",  # Pub/Inn
    0x1C: "G",  # Garth's Shop
    0x21: "T",  # Temple
    0x2B: "3",  # Review Board
    0x60: "S",  # Statue
    0x68: "#",  # Gate to Tower
    0x71: "T",  # Catacombs/Mad God Temple
    0x78: " ",  # Stairs from Sewers
    0x81: "1",  # Interplay Credits
    0x89: "1",  # Roscoe's Energy Emporium
    0x91: "1",  # Kylearan's Tower
    0x9B: "3",  # Harkyn's Castle
    0xA1: "1",  # Mangar's Tower
    0xA8: "|",  # City Gates
}

transS = {
    0x00: "0", # "Alley",
    0x01: "1", # "Rakhir",
    0x02: "2", # "Blacksmith",
    0x03: "3", # "Main",
    0x04: "4", # "Trumpet",
    0x05: "5", # "Grey Knife",
    0x06: "6", # "Stonework",
    0x07: "7", # "Emerald",
    0x08: "8", # "Hawk Scabbard",
    0x09: "9", # "Bard Blazon",
    0x0A: "A", # "Tempest",
    0x0B: "B", # "Fargoer",
    0x0C: "C", # "Blue Highway (a)",
    0x0D: "D", # "Night Archer",
    0x0E: "E", # "Serpent(skin)",
    0x0F: "F", # "Corbomite",
    0x10: "G", # "Sinister",
    0x11: "H", # "Marksman",
    0x12: "I", # "Dilvish",
    0x13: "J", # "Death Archer",
    0xFF: "K", # "Gran(d) Plaz",
}


rows = 30
columns = 30
dataH = btfile.load_compressed_file("city.pat", msdos_bt1_path)
print(len(dataH))
for i in range(rows):
    s = ""
    for j in range(columns):
        h = dataH[j + i * 30]
        s += transH[h]
    print s

dataS = btfile.load_compressed_file("city.nam", msdos_bt1_path)
print(len(dataS))
for i in range(rows):
    s = ""
    for j in range(columns):
        d = dataS[j + i * 30]
        h = dataH[j + i * 30]
        th = transH[h]
        if th == " " or th == "S" or th == "#":
            s += transS[d]
        else:
            s += "."
        # hex(0x100 + x)[-2:] + " "
    print s
