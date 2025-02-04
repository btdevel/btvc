/*
Known bugs:
 problems exiting concurrently running instances (a la Report+).
 resource leakage (unknown cause) (a la Report+).

Possible improvements:
 handle IBM-PC, etc. BT1/BT2, character formats.
 support for BT3, Hillsfar, etc. character formats.
 generate items list in-program rather than having a separate ReActor
  copy of every item name.
 condensation of empty inventory slots.
 'of's, 'to's should be vertically centred.
 enforcing that "current"s cannot be higher than "maximum"s.
 visual way to indicate that an item is unselectable (do in grey?).
 support doubleclick of listbrowser nodes.
 linting.
 to not allow "player"s to edit "monster/illusion" fields, and vice
  versa.
 information to include for items: nominal price, classes allowed to
  use, games it is allowed in (eg. BT1 only), armour improvement.
 use "image descriptions" (eg. dragon, etc.) for monster/illusion images,
  instead of numbers.
 allow editing of "items" file.

Issues to consider:
 how are bank accounts stored in BT2?
 how are charged items (eg. Dragonshield) stored in BT1?

#include "lint.h" */


/* 1. KEYWORDS -----------------------------------------------------------

Defined by AmigaOS are: IMPORT, UBYTE, UWORD, ULONG. */

#define AUTO                   auto   /* automatic variables */
#define MODULE                 static /* external static (file-scope) */
#define PERSIST                static /* internal static (function-scope) */
#define DISCARD                (void) /* discarded return values */
#define elif                   else if
#define acase                  break; case
#define adefault               break; default
#define EXPORT


#ifdef __STORM__
    typedef char               FLAG;
    typedef char               SBYTE;   /*  8-bit signed quantity (replaces Amiga BYTE) */
    typedef short              SWORD;   /* 16-bit signed quantity (replaces Amiga WORD) */
    typedef long               SLONG;   /* 32-bit signed quantity (same as LONG) */
    typedef long               SHUGE;
    typedef unsigned long long UHUGE;
    #define EXIT_SUCCESS  0
    #define EXIT_FAILURE 20
#endif


#define BT1               0
#define BT2               1

#define CLASSGAD_ARCHMAGE 0
#define CLASSGAD_ILLUSION 4
#define CLASSGAD_MONSTER  7
#define CLASSGAD_WARRIOR 11
#define CLASSGAD_WIZARD  12

#define RACEGAD_HUMAN     6


/* Any variables used in GetAttr() calls must be ULONGs. */
MODULE ULONG statusgad, race, theclass,
             curst, curiq, curdx, curcn, curlk,
             maxst, maxiq, maxdx, maxcn, maxlk,
             armour,
             curlev, maxlev,
             sorc, conj, magi, wiza, arch,
             songs, attacks, image, special, damage,
             cursor,
             game,
             equip[8], item[8], quantity[8],
             maxhp, curhp, maxsp, cursp,
             xp, gp;

MODULE TEXT                    asldir[512 + 1]   = "Bards Tale character disk:",
                               filename[512 + 1] = "",
                               tempfile[512 + 1];
MODULE UBYTE                   IOBuffer[96];

#define ITEMS 176 // actual number of items available (not counting "Nothing")

MODULE struct
{   UBYTE  bt1, bt2;
    STRPTR name;
} items[ITEMS + 1] =
{ 0,   0, "Nothing",        //   0
 62,  57, "Admt Chain",
 51,   0, "Admt Dagger",
 53,  51, "Admt Gloves",
 52,  50, "Admt Helm",
 54,   0, "Admt Mace",      //   5
 64,  59, "Admt Plate",
 63,   0, "Admt Scale",
 50,  49, "Admt Shield",
 49,  48, "Admt Sword",
  0,  72, "Ag's Arrows",    //  10
 58,  54, "Ali's Carpet",
  0, 102, "Angra's Eye",
  0, 101, "Aram's Knife",
105,   0, "Arc's Eye",
 85,   0, "Arc's Hammer",   //  15
 66,   0, "Arcshield",
  0,  22, "Arrows",
  0,  74, "Bard Bow",
 29,  29, "Bardsword",
 44,   0, "Blood Axe",      //  20
  0,  53, "Boomerang",
 65,  60, "Bracers [4]",
 28,  28, "Bracers [6]",
  0,  82, "Breathring",
  3,   3, "Broadsword",     //  25
 55,   0, "Broom",
  0, 105, "Brothers Fgn",
 10,  10, "Buckler",
  0,  57, "Bulldozer Fgn",
 13,  13, "Chain Mail",     //  30
  0,  30, "Cold Horn",
 84,  78, "Conjurstaff",
113,  89, "Crystal Sword",
  5,   5, "Dagger",
  0, 118, "Dagger!",        //  35
104,   0, "Dag Stone",
 45,  44, "Dayblade",
116,   0, "Death Dagger",
101,  88, "Deathring",
  0,  58, "Death Stars",    //  40
 80,   0, "Dmnd Dagger",
 81,  75, "Dmnd Helm",
 90,  84, "Dmnd Plate",
 79,  73, "Dmnd Shield",
 78,   0, "Dmnd Sword",     //  45
 41,   0, "Dork Ring",
108,  98, "Dragon Fgn",
 89,  83, "Dragonshield",
 93,  87, "Dragonwand",
  0,  93, "Drums of Death", //  50
  0, 106, "Dynamite",
  0,  76, "Elf Boots",
 47,  46, "Elf Cloak",
 57,   0, "Exorwand",
119,   0, "Eye",            //  55
 42,  41, "Fin's Flute",
 30,   0, "Fire Horn",
 96,  91, "Flame Horn",
 22,   0, "Flute",
 77,  71, "Frost Horn",     //  60
 76,  70, "Galt's Flute",
 19,  19, "Gauntlets",
 61,  27, "Giant Fgn",
 82,   0, "Golem Fgn",
  0, 109, "Grenade",        //  65
  7,   7, "Halbard",
 21,   0, "Harp",
 48,  47, "Hawkblade",
 75,   0, "Heal Harp",
 17,  17, "Helm",           //  70
  0, 103, "Herb Fgn",
  0, 115, "Item of Kazdek",
 43,  42, "Kael's Axe",
  0,  68, "Kato's Bracer",
 94,   0, "Kiel's Compass", //  75
 39,   0, "Lak's Lyre",
  2,   2, "Lamp",
 12,  12, "Leather Armor",
 18,  18, "Leather Glvs.",
118,   0, "Lich Fgn",       //  80
 31,  31, "Lightwand",
  0,   8, "Long Bow",
 92,   0, "Lorehelm",
 60,  55, "Luckshield",
  8,   0, "Mace",           //  85
109,   0, "Mage Fgn",
 68,  63, "Mage Staff",
 59,   0, "Magic Mouth",
 20,  20, "Mandolin",
  0,  99, "Mastermage Fgn", //  90
120, 110, "Master Key",
  0, 104, "Master Wand",
  0,  38, "Molten Fgn",
117,   0, "Mongo Fgn",
 88,   0, "Mournblade",     //  95
  0,  43, "Mthr Arrows",
 35,  35, "Mthr Axe",
 25,  25, "Mthr Chain",
 32,  32, "Mthr Dagger",
 34,  34, "Mthr Gloves",    // 100
 33,  33, "Mthr Helm",
 36,   0, "Mthr Mace",
 37,  37, "Mthr Plate",
 26,  26, "Mthr Scale",
 24,  24, "Mthr Shield",    // 105
 23,  23, "Mthr Sword",
  0, 111, "Nospin Ring",
 38,   0, "Ogre Fgn",
106,  67, "Ogrewand",
126,   0, "Old Man Fgn",    // 110
112,   0, "Onyx Key",
 99,  94, "Pipes of Pan",
 15,  15, "Plate Armor",
 87,  81, "Powerstaff",
 56,  52, "Pureblade",      // 115
 67,  62, "Pure Shield",
100,  95, "Ring of Power",
  0,  80, "Ring of Return",
 16,  16, "Robes",
 27,   0, "Samurai Fgn",    // 120
 14,  14, "Scale Armor",
  0, 119, "Seg #1",
  0, 120, "Seg #2",
  0, 121, "Seg #3",
  0, 122, "Seg #4",         // 125
  0, 123, "Seg #5",
  0, 124, "Seg #6",
  0, 125, "Seg #7",
 40,  40, "Shield Ring",
 46,  45, "Shield Staff",   // 130
  4,   4, "Short Sword",
  0,  36, "Shuriken",
123,   0, "Silver Circle",
122,   0, "Silver Square",
124,   0, "Silver Triangle", // 135
  0,  61, "Slayer Fgn",
  0,  96, "Song Axe",
 73,  69, "Sorcerstaff",
 71,  66, "Soul Mace",
103,   0, "Spectre Mace",   // 140
127, 127, "Spectre Snare",
  0,  21, "Spear",
 95,  90, "Speedboots",
  0,  39, "Spell Spear",
 98,   0, "Spiritdrum",     // 145
107,   0, "Spirithelm",
  9,   9, "Staff",
 86,  79, "Staff of Lor",
114, 108, "Stoneblade",
 74,   0, "Sword of Pak",   // 150
  0, 113, "Sword of Zar",
  0, 116, "The Ring",
  0, 126, "The Scepter",
 70,  65, "Thief Dagger",
125,   0, "Thor Fgn",       // 155
  0, 107, "Thor's Hammer",
 83,   0, "Titan Fgn",
  1,   1, "Torch",
  0, 112, "Torch!",
 11,  11, "Tower Shield",   // 160
115,   0, "Travelhelm",
  0,  97, "Trick Brick",
110, 100, "Troll Ring",
111,   0, "Troll Staff",
  0, 117, "Troy P.",        // 165
 97,   0, "Truthdrum",
  0,  77, "Van Fgn",
  0, 114, "Vial",
  6,   6, "War Axe",
 91,  85, "Wargloves",      // 170
 69,  64, "War Staff",
 72,   0, "Wither Staff",
  0,  86, "Wizhelm",
112,   0, "Wizwand",
102,   0, "Ybarrashield",   // 175
  0,  92, "Zen Arrows"      // 176
};

MODULE FLAG load(void);
MODULE void load_bt1(void);
MODULE void load_bt2(void);
MODULE ULONG getsize(void);
MODULE SLONG getlong(void);
MODULE SWORD getword(void);
MODULE UBYTE getfatbyte(void);
MODULE UBYTE getbyte(void);
MODULE void bt1_to_bt2(void);
MODULE void bt2_to_bt1(void);
MODULE void filetovar_race(UBYTE thebyte);
MODULE void filetovar_class(UBYTE thebyte);
MODULE void filetovar_status(UBYTE thebyte);
MODULE UBYTE vartofile_race(void);
MODULE UBYTE vartofile_class(void);
MODULE UBYTE vartofile_status(void);
MODULE void item_loop(ULONG gid, UWORD code, ULONG whichitem);
/* MODULE void condense(void); */

MODULE FLAG load(void)
{   ULONG size;
    BPTR  FileHandle /* = NULL */ ;

    size = getsize();
    if (size == 96)
    {   game = BT1;
    } elif (size == 86)
    {   game = BT2;
    } else
    {   return(FALSE);
    }

    if (!(FileHandle = (BPTR) Open(filename, MODE_OLDFILE)))
    {   return(FALSE);
    }
    if (Read(FileHandle, IOBuffer, (LONG) size) != size)
    {   DISCARD Close(FileHandle);
        // FileHandle = NULL;
        return(FALSE);
    }
    DISCARD Close(FileHandle);
    // FileHandle = NULL;

    cursor = 0;
    if (game == BT1)
    {   load_bt1();
    } else
    {   // assert(game == BT2);
        load_bt2();
    }
    refreshgadgets(TRUE);
    if (filename[0])
    {   SetWindowTitles(MainWindowPtr, filename, filename);
    } else
    {   SetWindowTitles(MainWindowPtr, "Untitled", "Untitled");
    }

    return(TRUE);
}

MODULE SWORD getword(void)
{   SWORD value;

    value = ((     256 * IOBuffer[cursor])
           +             IOBuffer[cursor + 1]
            );
    cursor += 2;
    return(value);
}
MODULE UBYTE getfatbyte(void)
{   UBYTE value;

    value =              IOBuffer[cursor + 1];
    cursor += 2;
    return(value);
}
MODULE SLONG getlong(void)
{   SLONG value;

    value = ((16777216 * IOBuffer[cursor])
           + (   65536 * IOBuffer[cursor + 1])
           + (     256 * IOBuffer[cursor + 2])
           +             IOBuffer[cursor + 3]
            );
    cursor += 4;
    return(value);
}
MODULE UBYTE getbyte(void)
{   UBYTE value;

    value = IOBuffer[cursor];
    cursor++;
    return(value);
}

MODULE void load_bt1(void)
{   ULONG i;
    UBYTE tempbyte;

    tempbyte = getword(); //  0- 1
    filetovar_status(tempbyte);

    tempbyte = getword(); //  2- 3
    filetovar_race(tempbyte);

    tempbyte = getword(); //  4- 5
    filetovar_class(tempbyte);

    curst  = getfatbyte(); //  6- 7
    curiq  = getfatbyte(); //  8- 9
    curdx  = getfatbyte(); // 10-11
    curcn  = getfatbyte(); // 12-13
    curlk  = getfatbyte(); // 14-15
    maxst  = getfatbyte(); // 16-17
    maxiq  = getfatbyte(); // 18-19
    maxdx  = getfatbyte(); // 20-21
    maxcn  = getfatbyte(); // 22-23
    maxlk  = getfatbyte(); // 24-25
    armour = getfatbyte(); // 26-27
    maxhp  = getword(); // 28-29
    curhp  = getword(); // 30-31
    maxsp  = getword(); // 32-33
    cursp  = getword(); // 34-35

    for (i = 0; i <= 7; i++)
    {   if (getbyte() == 0x80)
        {   equip[i] = TRUE;
        } else
        {   equip[i] = FALSE; // 36, 38, 40, 42, 44, 46, 48, 50
        }
        item[i] = getbyte();  // 37, 39, 41, 43, 45, 47, 49, 51
        if (item[i])
        {   quantity[i] = 255;
        } else
        {   quantity[i] = 0;
    }   }

    xp     = getlong(); // 52-55
    gp     = getlong(); // 56-59
    curlev = getfatbyte(); // 60-61
    maxlev = getfatbyte(); // 62-63
    sorc   = getfatbyte(); // 64-65
    conj   = getfatbyte(); // 66-67
    magi   = getfatbyte(); // 68-69
    wiza   = getfatbyte(); // 70-71
    cursor += 8;        // 72-79
    songs  = getfatbyte(); // 80-81
    // cursor += 14;       82-95

    arch = damage = image = special = 0;
    attacks = 1;
}
MODULE void save_bt1(void)
{   ULONG i;

    readgadgets();

    for (i = 0; i <= 95; i++)
    {   IOBuffer[i] = 0;
    }

    IOBuffer[1]  = vartofile_status();
    IOBuffer[3]  = vartofile_race();
    IOBuffer[5]  = vartofile_class();
    IOBuffer[7]  = (UBYTE) curst;
    IOBuffer[9]  = (UBYTE) curiq;
    IOBuffer[11] = (UBYTE) curdx;
    IOBuffer[13] = (UBYTE) curcn;
    IOBuffer[15] = (UBYTE) curlk;
    IOBuffer[17] = (UBYTE) maxst;
    IOBuffer[19] = (UBYTE) maxiq;
    IOBuffer[21] = (UBYTE) maxdx;
    IOBuffer[23] = (UBYTE) maxcn;
    IOBuffer[25] = (UBYTE) maxlk;
    IOBuffer[27] = (UBYTE) armour;
    IOBuffer[28] = (UBYTE) (maxhp / 256); // these parentheses are needed
    IOBuffer[29] = (UBYTE) (maxhp % 256);
    IOBuffer[30] = (UBYTE) (curhp / 256);
    IOBuffer[31] = (UBYTE) (curhp % 256);
    IOBuffer[32] = (UBYTE) (maxsp / 256);
    IOBuffer[33] = (UBYTE) (maxsp % 256);
    IOBuffer[34] = (UBYTE) (cursp / 256);
    IOBuffer[35] = (UBYTE) (cursp % 256);

    for (i = 0; i <= 7; i++)
    {   if (equip[i])
        {   IOBuffer[(i * 2) + 36] = 0x80;
        } else
        {   IOBuffer[(i * 2) + 36] = 0;
        }
        IOBuffer[(i * 2) + 37] = item[i];
    }

    IOBuffer[52] = (UBYTE)   (xp / 16777216);
    IOBuffer[53] = (UBYTE)  ((xp % 16777216) / 65536);
    IOBuffer[54] = (UBYTE) (((xp % 16777216) % 65536) / 256);
    IOBuffer[55] = (UBYTE) (((xp % 16777216) % 65536) % 256);
    IOBuffer[56] = (UBYTE)   (gp / 16777216);
    IOBuffer[57] = (UBYTE)  ((gp % 16777216) / 65536);
    IOBuffer[58] = (UBYTE) (((gp % 16777216) % 65536) / 256);
    IOBuffer[59] = (UBYTE) (((gp % 16777216) % 65536) % 256);
    IOBuffer[61] = (UBYTE) curlev;
    IOBuffer[63] = (UBYTE) maxlev;
    IOBuffer[65] = (UBYTE) sorc;
    IOBuffer[67] = (UBYTE) conj;
    IOBuffer[69] = (UBYTE) magi;
    IOBuffer[71] = (UBYTE) wiza;
    IOBuffer[81] = (UBYTE) songs;

    writeout(96);
}
MODULE void save_bt2(void)
{   ULONG i;

    readgadgets();

    for (i = 0; i <= 85; i++)
    {   IOBuffer[i] = 0;
    }

    if (theclass == CLASSGAD_MONSTER || theclass == CLASSGAD_ILLUSION)
    {   IOBuffer[0]  = 1;
    } else IOBuffer[0] = 0;

    IOBuffer[1]  = vartofile_status();
    IOBuffer[2]  = vartofile_race();
    IOBuffer[3]  = vartofile_class();
    IOBuffer[4]  = (UBYTE) curst;
    IOBuffer[5]  = (UBYTE) curiq;
    IOBuffer[6]  = (UBYTE) curdx;
    IOBuffer[7]  = (UBYTE) curcn;
    IOBuffer[8]  = (UBYTE) curlk;
    IOBuffer[9]  = (UBYTE) maxst;
    IOBuffer[10] = (UBYTE) maxiq;
    IOBuffer[11] = (UBYTE) maxdx;
    IOBuffer[12] = (UBYTE) maxcn;
    IOBuffer[13] = (UBYTE) maxlk;
    IOBuffer[17] = (UBYTE) armour;
    IOBuffer[18] = (UBYTE) (maxhp / 256); // these parenthese are needed
    IOBuffer[19] = (UBYTE) (maxhp % 256);
    IOBuffer[20] = (UBYTE) (curhp / 256);
    IOBuffer[21] = (UBYTE) (curhp % 256);
    IOBuffer[22] = (UBYTE) (maxsp / 256);
    IOBuffer[23] = (UBYTE) (maxsp % 256);
    IOBuffer[24] = (UBYTE) (cursp / 256);
    IOBuffer[25] = (UBYTE) (cursp % 256);

    for (i = 0; i <= 7; i++)
    {   if (equip[i])
        {   IOBuffer[(i * 2) + 26] = 0x80;
        } else
        {   IOBuffer[(i * 2) + 26] = 0;
        }
        IOBuffer[(i * 2) + 27] = item[i];
    }
    for (i = 0; i <= 7; i++)
    {   IOBuffer[i + 42]       = quantity[i];
    }

    IOBuffer[50] = (UBYTE)   (xp / 16777216);
    IOBuffer[51] = (UBYTE)  ((xp % 16777216) / 65536);
    IOBuffer[52] = (UBYTE) (((xp % 16777216) % 65536) / 256);
    IOBuffer[53] = (UBYTE) (((xp % 16777216) % 65536) % 256);
    IOBuffer[54] = (UBYTE)   (gp / 16777216);
    IOBuffer[55] = (UBYTE)  ((gp % 16777216) / 65536);
    IOBuffer[56] = (UBYTE) (((gp % 16777216) % 65536) / 256);
    IOBuffer[57] = (UBYTE) (((gp % 16777216) % 65536) % 256);
    IOBuffer[58] = (UBYTE) curlev;
    IOBuffer[59] = (UBYTE) maxlev;
    IOBuffer[60] = (UBYTE) sorc;
    IOBuffer[61] = (UBYTE) conj;
    IOBuffer[62] = (UBYTE) magi;
    IOBuffer[63] = (UBYTE) wiza;
    IOBuffer[64] = (UBYTE) arch;
    IOBuffer[69] = (UBYTE) songs;
    IOBuffer[73] = (UBYTE) attacks - 1;
    IOBuffer[83] = (UBYTE) image;

    switch(special)
    {
    case 1:
        IOBuffer[84] = 4; // aging
    acase 2:
        IOBuffer[84] = 7; // critical hit
    acase 3:
        IOBuffer[84] = 3; // insanity
    acase 4:
        IOBuffer[84] = 8; // item-zot
    acase 5:
        IOBuffer[84] = 2; // level drain
    acase 6:
        IOBuffer[84] = 9; // point phaze
    acase 7:
        IOBuffer[84] = 1; // poison
    acase 8:
        IOBuffer[84] = 5; // possession
    acase 9:
        IOBuffer[84] = 6; // stoned
    adefault: // eg. 0
        IOBuffer[84] = 0; // normal
    break;
    }

    IOBuffer[85] = (UBYTE) damage;

    writeout(86);
}
MODULE void load_bt2(void)
{   UBYTE tempbyte;
    ULONG i;

    cursor++;             //  0

    tempbyte = getbyte(); //  1
    filetovar_status(tempbyte);

    tempbyte = getbyte(); //  2
    filetovar_race(tempbyte);

    tempbyte = getbyte(); //  3
    filetovar_class(tempbyte);

    curst   = getbyte(); //  4
    curiq   = getbyte(); //  5
    curdx   = getbyte(); //  6
    curcn   = getbyte(); //  7
    curlk   = getbyte(); //  8
    maxst   = getbyte(); //  9
    maxiq   = getbyte(); // 10
    maxdx   = getbyte(); // 11
    maxcn   = getbyte(); // 12
    maxlk   = getbyte(); // 13
    cursor += 2;         // 14-15
    armour  = getword(); // 16-17
    maxhp   = getword(); // 18-19
    curhp   = getword(); // 20-21
    maxsp   = getword(); // 22-23
    cursp   = getword(); // 24-25
    for (i = 0; i <= 7; i++)
    {   if (getbyte() == 0x80)
        {   equip[i] = TRUE;
        } else equip[i] = FALSE; // 26, 28, 30, 32, 34, 36, 38, 40
        item[i]     = getbyte(); // 27, 29, 31, 33, 35, 37, 39, 41
    }
    for (i = 0; i <= 7; i++)
    {   quantity[i] = getbyte(); // 42-49
    }
    xp      = getlong(); // 50-53
    gp      = getlong(); // 54-57
    curlev  = getbyte(); // 58
    maxlev  = getbyte(); // 59
    sorc    = getbyte(); // 60
    conj    = getbyte(); // 61
    magi    = getbyte(); // 62
    wiza    = getbyte(); // 63
    arch    = getbyte(); // 64
    cursor += 4;         // 65-68
    songs   = getbyte(); // 69
    cursor += 3;         // 70-72
    attacks = getbyte() + 1; // 73
    cursor += 9;         // 74-82
    image   = getbyte(); // 83

    tempbyte = getbyte(); // 84
    switch(tempbyte)
    {
    case 1:
        special =  7; // poison
    acase 2:
        special =  5; // level drain
    acase 3:
        special =  3; // insanity
    acase 4:
        special =  1; // aging
    acase 5:
        special =  8; // possession
    acase 6:
        special =  9; // stoned
    acase 7:
        special =  2; // critical hit
    acase 8:
        special =  4; // item-zot
    acase 9:
        special =  6; // point phaze
    adefault: // eg. 0
        special =  0; // normal
    break;
    }

    damage  = getbyte(); // 85
}

MODULE void bt1_to_bt2(void)
{   UBYTE i, j;

    game = BT1;
    readgadgets();

    for (i = 0; i <= 7; i++)
    {   if (item[i])
        {   for (j = 1; j <= ITEMS; j++)
            {   if (item[i] == items[j].bt1)
                {   item[i] = items[j].bt2;
                    if (item[i] == 0)
                    {   quantity[i] = 0;
                    } else
                    {   quantity[i] = 255;
                    }
                    break;
    }   }   }   }
    // condense();

    game = BT2;
    refreshgadgets(TRUE);
}

MODULE void bt2_to_bt1(void)
{   UBYTE i, j;

    game = BT2;
    readgadgets();

    if (theclass == CLASSGAD_ARCHMAGE)
    {   theclass = CLASSGAD_WIZARD;
    } elif (theclass == CLASSGAD_MONSTER || theclass == CLASSGAD_ILLUSION)
    {   theclass = CLASSGAD_WARRIOR;
        race = RACEGAD_HUMAN;
        maxst = maxiq = maxdx = maxcn = maxlk =
        curst = curiq = curdx = curcn = curlk = 10;
        maxlev = curlev = 1;
        xp = songs = 0;
        // We assume no need to change spell levels, etc.
    }

    arch = damage = image = special = 0;
    attacks = 1;

    for (i = 0; i <= 7; i++)
    {   if (item[i])
        {   for (j = 1; j <= ITEMS; j++)
            {   if (item[i] == items[j].bt2)
                {   item[i] = items[j].bt1;
                    if (item[i] == 0)
                    {   quantity[i] = 0;
                    } else
                    {   quantity[i] = 255;
                    }
                    break;
    }   }   }   }
    // condense();

    game = BT1;
    refreshgadgets(TRUE);
}

MODULE ULONG getsize(void)
{   BPTR                  FileHandle /* = NULL */ ;
    ULONG                 size;
    struct FileInfoBlock* FIBPtr;

    if (!(FileHandle = (BPTR) Lock(filename, ACCESS_READ)))
    {   return(0);
    }
    if (!(FIBPtr = AllocDosObject(DOS_FIB, NULL)))
    {   UnLock(FileHandle);
        // FileHandle = NULL;
        return(0);
    }
    if (!(Examine(FileHandle, FIBPtr)))
    {   FreeDosObject(DOS_FIB, FIBPtr);
        // FIBPtr = NULL;
        UnLock(FileHandle);
        // FileHandle = NULL;
        return(0);
    }
    size = (ULONG) FIBPtr->fib_Size;
    FreeDosObject(DOS_FIB, FIBPtr);
    // FIBPtr = NULL;
    UnLock(FileHandle);
    // FileHandle = NULL;
    return(size);
}

int main(int argc, char** argv)
{   SLONG args[1] = {0};
    UWORD code;
    ULONG result, signals, MainSignal;

    /* These libraries are used:
    asl, dos, exec, gadtools, intuition, resource, version

    We are happy with any versions of asl, listbrowser. */

    // Check for OS3.5+...
    if
    (     IntuitionBase->LibNode.lib_Version < OS_31
     ||         SysBase->LibNode.lib_Version < OS_31
     ||    GadToolsBase->lib_Version         < OS_21
     ||        IconBase->lib_Version         < OS_35
     ||     VersionBase->lib_Version         < OS_35
     || !(ButtonBase      = OpenLibrary("gadgets/button.gadget",      OS_35 ))
     || !(CheckBoxBase    = OpenLibrary("gadgets/checkbox.gadget",    OS_35 ))
     || !(ChooserBase     = OpenLibrary("gadgets/chooser.gadget",     OS_35 ))
     || !(LabelBase       = OpenLibrary("images/label.image",         OS_35 ))
     || !(LayoutBase      = OpenLibrary("gadgets/layout.gadget",      OS_35 ))
     || !(ListBrowserBase = OpenLibrary("gadgets/listbrowser.gadget", OS_ANY))
     || !(SpaceBase       = OpenLibrary("gadgets/space.gadget",       OS_ANY))
     || !(StringBase      = OpenLibrary("gadgets/string.gadget",      OS_35 ))
     || !(WindowBase      = OpenLibrary("window.class",               OS_35 ))
     || !(IntegerBase     = OpenLibrary("gadgets/integer.gadget",     OS_35 ))
     || !(ResourceBase    = OpenLibrary("resource.library",           OS_ANY))
    )
    {   DISCARD Printf("Need AmigaOS 3.5+!\n");
        cleanexit(EXIT_FAILURE);
    }

    project_new();

    if (argc) // started from CLI
    {   if (!(ArgsPtr = ReadArgs
        (   "FILE/F", //  0
            (LONG *) args,
            NULL
        )))
        {   DISCARD Printf
            (   "Usage: %s [[FILE] <filename>]\n",
                argv[0]
            );
            cleanexit(EXIT_FAILURE);
        }
        if (args[0])
        {   // adding of "TPW." and ".C" is not done for CLI arguments
            strcpy(filename, (STRPTR) args[0]);
    }   }

    lockscreen();
    if (GetVPModeID(&(ScreenPtr->ViewPort)) == INVALID_ID)
    {   Printf("Invalid default public screen mode ID!\n");
        cleanexit(EXIT_FAILURE);
    }
    if (!(VisualInfoPtr = (struct VisualInfo *) GetVisualInfo(ScreenPtr, TAG_DONE)))
    {   Printf("Can't get GadTools visual info!\n");
        cleanexit(EXIT_FAILURE);
    }
    if (!(MenuPtr = CreateMenus(NewMenu, TAG_DONE)))
    {   Printf("Can't create menus!\n");
        cleanexit(EXIT_FAILURE);
    }
    if (!(LayoutMenus(MenuPtr, VisualInfoPtr, GTMN_NewLookMenus, TRUE, TAG_DONE)))
    {   Printf("Can't lay out menus!\n");
        cleanexit(EXIT_FAILURE);
    }
    if (!(ResourcePtr = RL_OpenResource(RCTResource, ScreenPtr, NULL)))
    {   rq("RL_OpenResource() failed!");
    }
    if (!(WinObject = RL_NewObject
    (   ResourcePtr,
        WIN_1_ID,
        WINDOW_MenuStrip, MenuPtr,
        WA_PubScreen,     ScreenPtr,
    TAG_END)))
    {   rq("RL_NewObject() failed!");
    }
    if (!(GadgetsPtr = (struct Gadget **) RL_GetObjectArray(ResourcePtr, WinObject, GROUP_2_ID)))
    {   rq("RL_GetObjectArray() failed!");
    }
    DoMethod(WinObject, WM_OPEN);
    DISCARD GetAttr(WINDOW_Window,  WinObject, (ULONG *) &MainWindowPtr);
    unlockscreen();
    DISCARD ActivateLayoutGadget(GadgetsPtr[GID_LY1], MainWindowPtr, NULL, (Object) GadgetsPtr[GID_IN1]);

    /* get the signalbit for the windowmessages */
    GetAttr(WINDOW_SigMask, WinObject, &MainSignal);

    if (args[0])
    {   open(TRUE);
    } else
    {   refreshgadgets(TRUE);
    }

    while (1)
    {   /* wait for a message or CTRL-C for user break */
        signals = Wait(MainSignal | SIGBREAKF_CTRL_C);

        /* handle the window-messages */
        if (signals & MainSignal)
        {   /* get next message */
            /* result: high word is the class, in low word is the event-describe */

            while((result = RA_HandleInput(WinObject, &code)) != WMHI_LASTMSG)
            {   switch(result & WMHI_CLASSMASK)
                {
                case WMHI_CLOSEWINDOW:
                    cleanexit(EXIT_SUCCESS);
                acase WMHI_GADGETUP:
                    /* Note: we use RL_GADGETMASK instead of WMHI_GADGETMASK
                     * because ReActor ors the gadget ID and the group ID to
                     * the final gadget ID. If you want to know in which group
                     * the gadget was use (result & RL_GROUPMASK).
                     */
                    loop(result & RL_GADGETMASK);
                acase WMHI_MENUPICK:
                    handlemenus(code);
                acase WMHI_RAWKEY:
                    /* raw key event, lower byte are the keycode, qualifiers only in hook-routine */
                    switch(code & 0xFF)
                    {
                    /* too easy to trigger accidentally when exiting a subwindow unless repeat qualifier is checked
                    case SCAN_ESCAPE:
                        cleanexit(EXIT_SUCCESS); */
                    case SCAN_HELP:
                        about();
                    adefault:
                    break;
                    }
                acase WMHI_VANILLAKEY:
                    /* ASCII-code in the lower byte (see RawKey) */
                    // we never seem to receive these messages
                adefault:
                break;
        }   }   }

        /* handle CTRL-C signal */
        if (signals & SIGBREAKF_CTRL_C)
        {   cleanexit(EXIT_SUCCESS);
    }   }

    // control shoul never reach this point
    assert(0);
}

MODULE void cleanexit(SBYTE rc)
{   // ASL requesters and About windows are assumed to be already closed.

    unlockscreen(); // in case the screen is locked

    if (MainWindowPtr)
    {   clearkybd();

        /* Disposing of the window object will also close the window if it is
         * already opened, and it will dispose of the layout object attached to it.
         */
        RL_DisposeObject(ResourcePtr, WinObject);
        WinObject = NULL;
        MainWindowPtr = NULL;
    }

    if (ResourcePtr)
    {   RL_CloseResource(ResourcePtr);
        ResourcePtr = NULL;
    }
    if (MenuPtr)
    {   FreeMenus(MenuPtr);
        MenuPtr = NULL;
    }
    if (VisualInfoPtr)
    {   FreeVisualInfo(VisualInfoPtr);
        VisualInfoPtr = NULL;
    }
    if (ArgsPtr)
    {   FreeArgs(ArgsPtr);
        ArgsPtr = NULL;
    }

    if      (ButtonBase) CloseLibrary(ButtonBase);
    if    (CheckBoxBase) CloseLibrary(CheckBoxBase);
    if     (ChooserBase) CloseLibrary(ChooserBase);
    if     (IntegerBase) CloseLibrary(IntegerBase);
    if       (LabelBase) CloseLibrary(LabelBase);
    if      (LayoutBase) CloseLibrary(LayoutBase);
    if (ListBrowserBase) CloseLibrary(ListBrowserBase);
    if       (SpaceBase) CloseLibrary(SpaceBase);
    if      (StringBase) CloseLibrary(StringBase);
    if      (WindowBase) CloseLibrary(WindowBase);
    if    (ResourceBase) CloseLibrary(ResourceBase);

    if (IntuitionBase)
    {   DISCARD OpenWorkBench();
    }

    exit(rc); // End of program.
}

MODULE void lockscreen(void)
{   if (!(ScreenPtr = LockPubScreen(NULL)))
    {   Printf("Can't lock default public screen!\n");
        cleanexit(EXIT_FAILURE);
}   }
MODULE void unlockscreen(void)
{   if (ScreenPtr)
    {   UnlockPubScreen(NULL, ScreenPtr);
        ScreenPtr = NULL;
}   }

MODULE void clearkybd(void)
{   struct IntuiMessage* MsgPtr;

    while ((MsgPtr = (struct IntuiMessage *) GT_GetIMsg(MainWindowPtr->UserPort)))
        GT_ReplyIMsg(MsgPtr);
}

MODULE void refreshgadgets(FLAG full)
{   ULONG        i, j;
    FLAG         found = FALSE;
    struct List* ListPtr;
    struct Node* NodePtr;

if (full)
{   // general
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_CH1], MainWindowPtr, NULL,
        CHOOSER_Selected, (WORD) game,
    TAG_END);
    RefreshGadgets((struct Gadget *) GadgetsPtr[GID_CH1], MainWindowPtr, NULL);

    DISCARD GetAttr(CHOOSER_Labels, GadgetsPtr[GID_CH2], (ULONG *) &ListPtr);
    DISCARD SetGadgetAttrs(GadgetsPtr[GID_CH2], MainWindowPtr, NULL, CHOOSER_Labels, ~0, TAG_END);
    assert(ListPtr->lh_Head->ln_Succ); // the list is non-empty
    i = 0;
    // Walk the list
    for
    (   NodePtr = ListPtr->lh_Head;
        NodePtr->ln_Succ;
        NodePtr = NodePtr->ln_Succ
    )
    {   if
        (   i == CLASSGAD_ARCHMAGE
         || i == CLASSGAD_ILLUSION
         || i == CLASSGAD_MONSTER
        )
        {   if (game == BT1)
            {   DISCARD SetChooserNodeAttrs(NodePtr, CNA_Disabled, TRUE,  TAG_END);
            } else
            {   assert(game == BT2);
                DISCARD SetChooserNodeAttrs(NodePtr, CNA_Disabled, FALSE, TAG_END);
        }   }
        i++;
    }
    DISCARD SetGadgetAttrs(GadgetsPtr[GID_CH2], MainWindowPtr, NULL, CHOOSER_Labels,   ListPtr,         TAG_END);
    DISCARD SetGadgetAttrs(GadgetsPtr[GID_CH2], MainWindowPtr, NULL, CHOOSER_Selected, (WORD) theclass, TAG_END);
    RefreshGadgets((struct Gadget *) GadgetsPtr[GID_CH2], MainWindowPtr, NULL);

    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN1], MainWindowPtr, NULL,
        INTEGER_Number, gp,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN2], MainWindowPtr, NULL,
        INTEGER_Number, curhp,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN3], MainWindowPtr, NULL,
        INTEGER_Number, maxhp,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN4], MainWindowPtr, NULL,
        INTEGER_Number, cursp,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN5], MainWindowPtr, NULL,
        INTEGER_Number, maxsp,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_CH5], MainWindowPtr, NULL,
        CHOOSER_Selected, (WORD) statusgad,
    TAG_END);
    RefreshGadgets((struct Gadget *) GadgetsPtr[GID_CH5], MainWindowPtr, NULL);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN21], MainWindowPtr, NULL,
        INTEGER_Number, armour,
    TAG_END);

    // attributes
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN6], MainWindowPtr, NULL,
        INTEGER_Number, curst,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN7], MainWindowPtr, NULL,
        INTEGER_Number, curiq,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN8], MainWindowPtr, NULL,
        INTEGER_Number, curdx,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN9], MainWindowPtr, NULL,
        INTEGER_Number, curcn,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN10], MainWindowPtr, NULL,
        INTEGER_Number, curlk,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN11], MainWindowPtr, NULL,
        INTEGER_Number, maxst,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN12], MainWindowPtr, NULL,
        INTEGER_Number, maxiq,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN13], MainWindowPtr, NULL,
        INTEGER_Number, maxdx,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN14], MainWindowPtr, NULL,
        INTEGER_Number, maxcn,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN15], MainWindowPtr, NULL,
        INTEGER_Number, maxlk,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN16], MainWindowPtr, NULL,
        INTEGER_Number, magi,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN17], MainWindowPtr, NULL,
        INTEGER_Number, conj,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN18], MainWindowPtr, NULL,
        INTEGER_Number, sorc,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN19], MainWindowPtr, NULL,
        INTEGER_Number, wiza,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN20], MainWindowPtr, NULL,
        INTEGER_Number, arch,
        GA_Disabled,    game == BT1,
    TAG_END);

    // illusions/monsters
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN22], MainWindowPtr, NULL,
        INTEGER_Number, attacks,
        GA_Disabled,    game == BT1,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN23], MainWindowPtr, NULL,
        INTEGER_Number, damage,
        GA_Disabled,    game == BT1,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_BU1], MainWindowPtr, NULL,
        BUTTON_Integer, damage * 4,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN24], MainWindowPtr, NULL,
        INTEGER_Number, image,
        GA_Disabled,    game == BT1,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_CH3], MainWindowPtr, NULL,
        CHOOSER_Selected, (WORD) special,
        GA_Disabled,    game == BT1,
    TAG_END);
    RefreshGadgets((struct Gadget *) GadgetsPtr[GID_CH3], MainWindowPtr, NULL);

    // players
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_CH4], MainWindowPtr, NULL,
        CHOOSER_Selected, (WORD) race,
    TAG_END);
    RefreshGadgets((struct Gadget *) GadgetsPtr[GID_CH4], MainWindowPtr, NULL);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN25], MainWindowPtr, NULL,
        INTEGER_Number, curlev,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN26], MainWindowPtr, NULL,
        INTEGER_Number, maxlev,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN27], MainWindowPtr, NULL,
        INTEGER_Number, songs,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_IN28], MainWindowPtr, NULL,
        INTEGER_Number, xp,
    TAG_END);
    DISCARD SetGadgetAttrs
    (   GadgetsPtr[GID_CH5], MainWindowPtr, NULL,
        CHOOSER_Selected, statusgad,
    TAG_END);
    RefreshGadgets((struct Gadget *) GadgetsPtr[GID_CH5], MainWindowPtr, NULL);
}

    // items
    for (i = 0; i <= 7; i++)
    {   DISCARD SetGadgetAttrs
        (   GadgetsPtr[gad_cb[i]], MainWindowPtr, NULL,
            GA_Selected, equip[i],
        TAG_END);
        RefreshGadgets((struct Gadget *) GadgetsPtr[gad_cb[i]], MainWindowPtr, NULL);

        if (item[i])
        {   found = FALSE;

            for (j = 1; j <= ITEMS; j++)
            {   if
                (   (game == BT1 && items[j].bt1 == item[i])
                 || (game == BT2 && items[j].bt2 == item[i])
                )
                {   DISCARD SetGadgetAttrs
                    (   GadgetsPtr[gad_st[i]], MainWindowPtr, NULL,
                        STRINGA_TextVal, items[j].name,
                    TAG_END);
                    found = TRUE;
                    break;
            }   }

            if (!found)
            {   // we should not reach this point normally
                DISCARD SetGadgetAttrs
                (   GadgetsPtr[gad_st[i]], MainWindowPtr, NULL,
                    STRINGA_TextVal, "?",
                TAG_END);
        }   }
        else
        {   DISCARD SetGadgetAttrs
            (   GadgetsPtr[gad_st[i]], MainWindowPtr, NULL,
                STRINGA_TextVal, "-",
            TAG_END);
        }
        DISCARD SetGadgetAttrs
        (   GadgetsPtr[gad_in[i]], MainWindowPtr, NULL,
            INTEGER_Number, quantity[i],
            GA_Disabled,    game == BT1,
        TAG_END);
}   }

MODULE void rq(STRPTR message)
{   Printf("%s\n", message);
    cleanexit(EXIT_FAILURE);
}

MODULE void writeout(SLONG length)
{   BPTR FileHandle;

    if (!(FileHandle = (BPTR) Open(filename, MODE_NEWFILE)))
        rq("Can't open file for writing!");
    if (Write(FileHandle, IOBuffer, length) != length)
    {   DISCARD Close(FileHandle);
        rq("Can't write to file!");
    }
    DISCARD Close(FileHandle);
}

MODULE void open(FLAG revert)
{   if (revert || asl(FALSE))
    {   load();
        refreshgadgets(TRUE);
}   }
MODULE void save(FLAG saveas)
{   if ((filename[0] && !saveas) || asl(TRUE))
    {   if (game == BT1)
        {   save_bt1();
        } else
        {   assert(game == BT2);
            save_bt2();
    }   }
    if (filename[0])
    {   SetWindowTitles(MainWindowPtr, filename, filename);
    } else
    {   SetWindowTitles(MainWindowPtr, "Untitled", "Untitled");
}   }

MODULE FLAG asl(FLAG save)
{   struct FileRequester* ASLRqPtr;
    FLAG                  success;
    LONG                  length;
    ULONG                 flags;
    TEXT                  hail[18 + 1];

    if (save)
    {   flags = FILF_PATGAD | FILF_SAVE;
        if (game == BT1)
        {   strcpy(hail, "Save BT1 Character");
        } else
        {   assert(game == BT2);
            strcpy(hail, "Save BT2 Character");
        }
    } else
    {   flags = FILF_PATGAD;
        strcpy(hail, "Load Character");
    }

    /* asldir is the directory that the ASL requester will start in. */

    if (!(ASLRqPtr = AllocAslRequestTags(ASL_FileRequest, ASL_Pattern, "TPW.#?.C", ASL_Window, MainWindowPtr, TAG_DONE)))
        rq("Can't create ASL request!");
    if
    (   AslRequestTags(ASLRqPtr, ASL_Dir, asldir, ASL_Hail, hail, ASL_FuncFlags, flags, TAG_DONE)
     && *(ASLRqPtr->rf_File) != 0
    )
    {   strcpy(asldir, ASLRqPtr->rf_Dir);
        strcpy(filename, ASLRqPtr->rf_Dir);

        if (strnicmp(ASLRqPtr->rf_File, "TPW.", 4))
        {   strcpy(tempfile, "TPW.");
        } else
        {   tempfile[0] = 0;
        }
        strcat(tempfile, ASLRqPtr->rf_File);
        length = strlen(ASLRqPtr->rf_File);
        if
        (   ASLRqPtr->rf_File[length - 2] != '.'
         || (ASLRqPtr->rf_File[length - 1] != 'C' && ASLRqPtr->rf_File[length - 1] != 'c')
        )
        {   strcat(tempfile, ".C");
        }

        if (!AddPart(filename, tempfile, 512))
        {   FreeAslRequest(ASLRqPtr);
            rq("AddPart() failed!");
        }

        success = TRUE;
    } else
    {   // either the user chose Cancel, or clicked OK with an empty filename
        strcpy(filename, "");
        success = FALSE;
    }
    assert((int) ASLRqPtr);
    FreeAslRequest(ASLRqPtr);

    return(success);
}

MODULE void handlemenus(UWORD code)
{   /* struct MenuItem* ItemPtr; */

    if (code != MENUNULL) /* while (code != MENUNULL) */
    {   /* ItemPtr = ItemAddress(MenuPtr, code); */
        switch (MENUNUM(code))
        {
        case MN_PROJECT:
            switch (ITEMNUM(code))
            {
            case IN_NEW:
                project_new();
                refreshgadgets(TRUE);
            acase IN_OPEN:
                open(FALSE);
            acase IN_REVERT:
                open(TRUE);
            acase IN_SAVE:
                save(FALSE);
            acase IN_SAVEAS:
                save(TRUE);
            acase IN_QUIT:
                cleanexit(EXIT_SUCCESS);
            adefault:
            break;
            }
        acase MN_HELP:
            switch (ITEMNUM(code))
            {
            case IN_ABOUT:
                about();
            adefault:
            break;
            }
        adefault:
        break;
        }
        /* Doing things the above way disables multi-selection,
        but prevents `endless selection'.
        code = ItemPtr->NextSelect; */
}   }

MODULE void loop(ULONG gid)
{   switch(gid)
    {
    case GID_CH1:
        if (game == BT1)
        {   DISCARD GetAttr(CHOOSER_Selected, GadgetsPtr[GID_CH1],  (ULONG *) &game);
            if (game == BT2)
            {   bt1_to_bt2();
        }   }
        else
        {   assert(game == BT2);
            DISCARD GetAttr(CHOOSER_Selected, GadgetsPtr[GID_CH1],  (ULONG *) &game);
            if (game == BT1)
            {   bt2_to_bt1();
        }   }
    acase GID_IN23:
        DISCARD GetAttr(INTEGER_Number,       GadgetsPtr[GID_IN23], (ULONG *) &damage);
        DISCARD SetGadgetAttrs
        (   GadgetsPtr[GID_BU1], MainWindowPtr, NULL,
            BUTTON_Integer, damage * 4,
        TAG_END);
        RefreshGadgets((struct Gadget *) GadgetsPtr[GID_BU1], MainWindowPtr, NULL);
    acase GID_BU2:
        itemwindow(0);
    acase GID_BU3:
        itemwindow(1);
    acase GID_BU4:
        itemwindow(2);
    acase GID_BU5:
        itemwindow(3);
    acase GID_BU6:
        itemwindow(4);
    acase GID_BU7:
        itemwindow(5);
    acase GID_BU8:
        itemwindow(6);
    acase GID_BU9:
        itemwindow(7);
    adefault:
    break;
}   }

MODULE void itemwindow(ULONG whichitem)
{   FLAG            done;
    UWORD           code;
    ULONG           event,
                    i,
                    ItemSignal,
                    ordinal,
                    result;
    struct Window*  ItemWindowPtr;
    struct Node*    NodePtr;
    struct List*    ListPtr;
    struct Gadget** ItemGadgetsPtr;
    Object*         ItemWinObject;

    lockscreen();
    if (!(ItemWinObject = RL_NewObject
    (   ResourcePtr,
        WIN_5_ID,
        WA_PubScreen, ScreenPtr,
    TAG_END)))
    {   rq("RL_NewObject() failed!");
    }
    if (!(ItemGadgetsPtr = (struct Gadget **) RL_GetObjectArray(ResourcePtr, ItemWinObject, GROUP_6_ID)))
    {   rq("RL_GetObjectArray() failed!");
    }
    DoMethod(ItemWinObject, WM_OPEN);
    DISCARD GetAttr(WINDOW_Window,  ItemWinObject, (ULONG *) &ItemWindowPtr);
    unlockscreen();

    for (i = 0; i <= ITEMS; i++)
    {   if (game == BT1 && item[whichitem] == i)
        {   DISCARD SetGadgetAttrs(ItemGadgetsPtr[GID_LB1], ItemWindowPtr, NULL, LISTBROWSER_Selected, i, TAG_END);
            ordinal = i;
            break;
        } elif (game == BT2 && item[whichitem] == i)
        {   DISCARD SetGadgetAttrs(ItemGadgetsPtr[GID_LB1], ItemWindowPtr, NULL, LISTBROWSER_Selected, i, TAG_END);
            ordinal = i;
            break;
    }   }
    RefreshGadgets((struct Gadget *) ItemGadgetsPtr[GID_LY2], ItemWindowPtr, NULL);

    DISCARD GetAttr(LISTBROWSER_Labels, ItemGadgetsPtr[GID_LB1], (ULONG *) &ListPtr);
    DISCARD SetGadgetAttrs(ItemGadgetsPtr[GID_LB1], ItemWindowPtr, NULL, LISTBROWSER_MakeVisible, ordinal, TAG_END);
    DISCARD SetGadgetAttrs(ItemGadgetsPtr[GID_LB1], ItemWindowPtr, NULL, LISTBROWSER_Labels, ~0, TAG_END);
    assert(ListPtr->lh_Head->ln_Succ); // the list is non-empty
    i = 0;
    // Walk the list
    for
    (   NodePtr = ListPtr->lh_Head;
        NodePtr->ln_Succ;
        NodePtr = NodePtr->ln_Succ
    )
    {   if (game == BT1)
        {   if (i == 0 || items[i].bt1)
            {   DISCARD SetListBrowserNodeAttrs(NodePtr, LBNA_Flags, NULL,           TAG_END);
            } else
            {   DISCARD SetListBrowserNodeAttrs(NodePtr, LBNA_Flags, LBFLG_READONLY, TAG_END);
        }   }
        else
        {   assert(game == BT2);
            if (i == 0 || items[i].bt2)
            {   DISCARD SetListBrowserNodeAttrs(NodePtr, LBNA_Flags, NULL,           TAG_END);
            } else
            {   DISCARD SetListBrowserNodeAttrs(NodePtr, LBNA_Flags, LBFLG_READONLY, TAG_END);
        }   }
        i++;
    }
    DISCARD SetGadgetAttrs(ItemGadgetsPtr[GID_LB1], ItemWindowPtr, NULL, LISTBROWSER_Labels, ListPtr, TAG_END);
    RefreshGadgets((struct Gadget *) ItemGadgetsPtr[GID_LB1], ItemWindowPtr, NULL);

    // Obtain the window wait signal mask.
    DISCARD GetAttr(WINDOW_SigMask, ItemWinObject, (ULONG *) &ItemSignal);

    done = FALSE;
    while (!done)
    {   if ((Wait(ItemSignal | SIGBREAKF_CTRL_C)) & SIGBREAKF_CTRL_C)
        {   DoMethod(ItemWinObject, WM_CLOSE);
            RL_DisposeObject(ResourcePtr, ItemWinObject);
            cleanexit(EXIT_SUCCESS);
        }
        while ((result = DoMethod(ItemWinObject, WM_HANDLEINPUT, &code)) != WMHI_LASTMSG)
        {   /* There seems to be a bug in StormC affecting the code
            generation:

            Some switch statements can cause a "bxx.b L0" to
            be generated by the compiler. No label L0 is defined, thus
            we get "Panic: Assembler failed at n: Undefined Label". */
            event = result & WMHI_CLASSMASK;
            if (event == WMHI_CLOSEWINDOW)
            {   done = TRUE;
            } elif (event == WMHI_GADGETUP)
            {   /* Note: we use RL_GADGETMASK instead of WMHI_GADGETMASK
                 * because ReActor ors the gadget ID and the group ID to
                 * the final gadget ID. If you want to know in which group
                 * the gadget was use (result & RL_GROUPMASK).
                 */
                item_loop(result & RL_GADGETMASK, code, whichitem);
            } elif (event == WMHI_RAWKEY)
            {   /* raw key event, lower byte are the keycode, qualifiers only in hook-routine */
                switch(code & 0xFF)
                {
                case SCAN_ESCAPE:
                    done = TRUE;
                acase SCAN_UP:
                    DISCARD SetGadgetAttrs(ItemGadgetsPtr[GID_LB1], ItemWindowPtr, NULL, LISTBROWSER_Position, LBP_LINEUP,   TAG_END);
                acase SCAN_DOWN:
                    DISCARD SetGadgetAttrs(ItemGadgetsPtr[GID_LB1], ItemWindowPtr, NULL, LISTBROWSER_Position, LBP_LINEDOWN, TAG_END);
                adefault:
                break;
    }   }   }   }

    DoMethod(ItemWinObject, WM_CLOSE);
    RL_DisposeObject(ResourcePtr, ItemWinObject);
}

MODULE void about(void)
{   FLAG           done;
    UWORD          code;
    ULONG          AboutSignal,
                   event,
                   result;
    Object*        AboutWinObject = NULL;
    struct Window* AboutWindowPtr = NULL;

    lockscreen();
    if (!(AboutWinObject = RL_NewObject
    (   ResourcePtr,
        WIN_3_ID,
        WA_PubScreen, ScreenPtr,
    TAG_END)))
    {   rq("RL_NewObject() failed!");
    }
    DoMethod(AboutWinObject, WM_OPEN);
    DISCARD GetAttr(WINDOW_Window,  AboutWinObject, (ULONG *) &AboutWindowPtr);
    unlockscreen();

    /* This should really have a ReActor-style loop rather than
       a ReAction-style one, although it seems to work. */

    // Obtain the window wait signal mask.
    DISCARD GetAttr(WINDOW_SigMask, AboutWinObject, (ULONG *) &AboutSignal);

    done = FALSE;
    while (!done)
    {   if ((Wait(AboutSignal | SIGBREAKF_CTRL_C)) & SIGBREAKF_CTRL_C)
        {   DoMethod(AboutWinObject, WM_CLOSE);
            RL_DisposeObject(ResourcePtr, AboutWinObject);
            cleanexit(EXIT_SUCCESS);
        }
        while ((result = DoMethod(AboutWinObject, WM_HANDLEINPUT, &code)) != WMHI_LASTMSG)
        {   /* There seems to be a bug in StormC affecting the code
            generation:

            Some switch statements can cause a "bxx.b L0" to
            be generated by the compiler. No label L0 is defined, thus
            we get "Panic: Assembler failed at n: Undefined Label". */
            event = result & WMHI_CLASSMASK;
            if (event == WMHI_CLOSEWINDOW)
            {   done = TRUE;
            } elif (event == WMHI_RAWKEY)
            {   /* raw key event, lower byte are the keycode, qualifiers only in hook-routine */
                switch(code & 0xFF)
                {
                case SCAN_ESCAPE:
                    done = TRUE;
                adefault:
                break;
    }   }   }   }

    DoMethod(AboutWinObject, WM_CLOSE);
    RL_DisposeObject(ResourcePtr, AboutWinObject);
}

MODULE void filetovar_race(UBYTE thebyte)
{   switch(thebyte)
    {
    case 1:
        race = 1; // elf
    acase 2:
        race = 0; // dwarf
    acase 3:
        race = 5; // hobbit
    acase 4:
        race = 3; // half-elf
    acase 5:
        race = 4; // half-orc
    acase 6:
        race = 2; // gnome
    adefault: // eg. 0
        race = 6; // human
    break;
}   }
MODULE void filetovar_class(UBYTE thebyte)
{   switch(thebyte)
    {
    case 1:
        theclass =  8; // paladin
    acase 2:
        theclass =  9; // rogue
    acase 3:
        theclass =  1; // bard
    acase 4:
        theclass =  3; // hunter
    acase 5:
        theclass =  6; // monk
    acase 6:
        theclass =  2; // conjurer
    acase 7:
        theclass =  5; // magician
    acase 8:
        theclass = 10; // sorcerer
    acase 9:
        theclass = 12; // wizard
    acase 10:
        theclass =  0; // archmage
    acase 11:
        theclass =  7; // monster
    acase 12:
        theclass =  4; // illusion
    adefault: // eg. 0
        theclass = 11; // warrior
    break;
}   }
MODULE UBYTE vartofile_race(void)
{   UBYTE thebyte;

    switch(race)
    {
    case 0:
        thebyte = 2; // dwarf
    acase 1:
        thebyte = 1; // elf
    acase 2:
        thebyte = 6; // gnome
    acase 3:
        thebyte = 4; // half-elf
    acase 4:
        thebyte = 5; // half-orc
    acase 5:
        thebyte = 3; // hobbit
    acase 6:
        thebyte = 0; // human
    adefault:
        assert(0);
    break;
    }

    return(thebyte);
}
MODULE UBYTE vartofile_class(void)
{   UBYTE thebyte;

    switch(theclass)
    {
    case 0:
        thebyte = 10; // archmage
    acase 1:
        thebyte =  3; // bard
    acase 2:
        thebyte =  6; // conjurer
    acase 3:
        thebyte =  4; // hunter
    acase 4:
        thebyte = 12; // illusion
    acase 5:
        thebyte =  7; // magician
    acase 6:
        thebyte =  5; // monk
    acase 7:
        thebyte = 11; // monster
    acase 8:
        thebyte =  1; // paladin
    acase 9:
        thebyte =  2; // rogue
    acase 10:
        thebyte =  8; // sorcerer
    acase 11:
        thebyte =  0; // warrior
    acase 12:
        thebyte =  9; // wizard
    adefault:
        assert(0);
    break;
    }

    return(thebyte);
}
MODULE UBYTE vartofile_status(void)
{   UBYTE thebyte;

    switch(statusgad)
    {
    case 0:
        thebyte = 0;    // OK
    acase 1:
        thebyte = 0x02; // dead
    acase 2:
        thebyte = 0x80; // insane
    acase 3:
        thebyte = 0x04; // old
    acase 4:
        thebyte = 0x20; // paralyzed
    acase 5:
        thebyte = 0x08; // poisoned
    acase 6:
        thebyte = 0x40; // possessed
    acase 7:
        thebyte = 0x10; // stoned
    adefault:
        assert(0);
    break;
    }

    return(thebyte);
}
MODULE void filetovar_status(UBYTE thebyte)
{   switch(thebyte)
    {
    case 0x80:
        statusgad = 2; // insane
    acase 0x40:
        statusgad = 6; // possessed
    acase 0x20:
        statusgad = 4; // paralyzed
    acase 0x10:
        statusgad = 7; // stoned
    acase 0x08:
        statusgad = 5; // poisoned
    acase 0x04:
        statusgad = 3; // old
    acase 0x02:
        statusgad = 1; // dead
    adefault:
        // eg. 0, which is perfect health
        statusgad = 0; // OK
    break;
}   }

MODULE void item_loop(ULONG gid, UWORD code, ULONG whichitem)
{	 switch(gid)
    {
    case GID_LB1:
        if (code == 0)
        {   quantity[whichitem] = 0;
            equip[whichitem] = FALSE;
        } elif (item[whichitem] == 0)
        {   quantity[whichitem] = 255;
        }
        if (game == BT1)
        {   item[whichitem] = items[code].bt1;
        } else
        {   assert(game == BT2);
            item[whichitem] = items[code].bt2;
        }
    adefault:
    break;
    }

    refreshgadgets(FALSE);
}

MODULE void project_new(void)
{   ULONG i;

    statusgad =
    sorc      =
    conj      =
    magi      =
    wiza      =
    arch      =
    songs     =
    image     =
    special   =
    damage    =
    maxsp     =
    cursp     =
    xp        = 0;

    attacks   =
    curlev    =
    maxlev    = 1;

    curst     =
    curiq     =
    curdx     =
    curcn     =
    curlk     =
    maxst     =
    maxiq     =
    maxdx     =
    maxcn     =
    maxlk     =
    armour    =
    maxhp     =
    curhp     = 10;

    gp        = 100;

    for (i = 0; i <= 7; i++)
    {   equip[i]    = FALSE;
        item[i]     = 0;
        quantity[i] = 0;
    }

    theclass  = CLASSGAD_WARRIOR;
    race      = RACEGAD_HUMAN;
}

#ifdef __STORM__
void wbmain(struct WBStartup* WBMsg)
{   main(0, NULL);
}
#endif
