import glob
import struct

import bt.extract.btfile as btfile
import bt.char as btchar

# https://docs.python.org/3/library/struct.html
# https://bardstale.brotherhood.de/talefiles/1/hacks/bt1-msdos-character_file_format.htm

# >14s 2x=big endian(>), char[14], 2x=2 padding bytes
# B = unsigned char
# H = unsigned short
# L = unsigned long

base_fields  = [("name", "14s"),
                (None, "2x"),
                ("char_party", "B")]


char_fields  = [("name", "14s"),
                (None, "2x"),
                ("char_party", "B"),
                ("status", "<H"),
                ("race", "<H"),
                ("char_class", "<H"),
                ("curr_str", "<H"),
                ("curr_int", "<H"),
                ("curr_dex", "<H"),
                ("curr_con", "<H"),
                ("curr_lck", "<H"),
                ("max_str", "<H"),
                ("max_int", "<H"),
                ("max_dex", "<H"),
                ("max_con", "<H"),
                ("max_lck", "<H2x"),
                ("max_hp", "<H"),
                ("curr_hp", "<H"),
                ("max_sp", "<H"),
                ("curr_sp", "H"),
                ("equipment", "16B"),
                ("experience", "<L"),
                ("gold", "<L"),
                ("level", "<H"),
                (None, "3x"),
                ("con_level", "B"),
                ("mag_level", "B"),
                ("sor_level", "B"),
                ("wiz_level", "B"),
                (None, "7x"),
                ("num_songs", "B"),
                (None, "15x"),
                # ("num_songs", "B15x")
                ]

party_fields = [("name", "14s"),
                (None, "2x"),
                ("char_party", "B"),
                ("name1", "14s"),
                (None, "2x"),
                ("name2", "14s"),
                (None, "2x"),
                ("name3", "14s"),
                (None, "2x"),
                ("name4", "14s"),
                (None, "2x"),
                ("name5", "14s"),
                (None, "2x"),
                ("name6", "14s"),
                (None, "2x")]


def fill_fields_from_buffer(char, fields, buffer, show_fields=False):
    offset = 0
    buffer = bytes(buffer)
    for field in fields:
        attr_name, fmt = field
        value = struct.unpack_from(fmt, buffer, offset)
        if len(value) == 1:
            value = value[0]
        if isinstance(value, str):
            value=value.split("\0")[0]
        if attr_name:
            char.__setattr__(attr_name, value)
            if show_fields:
                print(attr_name + "  (" + str(offset) + "): " + str(value))
        offset += struct.calcsize(fmt)


def load_character(filename):
    info = load_base_info(filename)
    if info.is_party:
        return load_party(filename)

    ba = btfile.load_file(filename)
    char = btchar.Character()
    fill_fields_from_buffer(char, char_fields, ba)
    return char


def load_character_by_name(btpath, name):
    char_list = get_char_list(btpath)
    for char in char_list:
        if char.name==name:
            return load_character(char.filename)
    return None


def load_party(filename):
    ba = btfile.load_file(filename)
    party = btchar.Party()
    fill_fields_from_buffer(party, party_fields, ba)
    return party

def load_base_info(filename):
    ba = btfile.load_file(filename)
    char = btchar.Character(id)
    fill_fields_from_buffer(char, base_fields, ba)
    char_info = btchar.CharPartyBase(char.char_party == 2)
    char_info.name = char.name
    char_info.filename = filename
    return char_info

def get_char_list(btpath):
    files = glob.glob(btpath + "/*.TPW")
    filelist = []
    for filename in files:
        char = load_base_info(filename)
        filelist.append(char)

    return filelist

#In config: char_loader = bt.extract.bt1.char_msdos.Loader
class Loader(object):
    def __init__(self, char_path):
        self.char_path = char_path
        
    def char_list(self):
        return get_char_list(self.char_path)

    def load_char(self, filename):
        return load_character(filename)

    def load_char_by_name(self, name):
        return load_character_by_name(self.char_path, name)

    def save_char(self):
        raise NotImplemented

    def __str__(self):
        return "MSDOS loader for BT1 (path='%s')" % self.char_path

