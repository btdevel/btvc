/* Bard's Tale Character Definition */
#include "bt_types.h"
#if !defined(_BARDCHAR)
#define _BARDCHAR
#include <stdio.h>

#define BT_DEAD      0x02
#define BT_OLD       0x04
#define BT_POISONED  0x08
#define BT_STONED    0x10
#define BT_PARALYZED 0x20
#define BT_POSSESSED 0x40
#define BT_NUTS      0x80 

struct CHARITEM {
    char code;
    char status;
};
enum CLASS {
        Warrior, Paladin, Rogue, Bard, Hunter,
        Monk, Conjurer, Magician, Sorceror, Wizard
        
};
enum RACE { 
        Human, Elf, Dwarf, Hobbit, 
        Half_elf, Half_orc, Gnome
};
struct BARDCHAR {
/*00*/    INT16 status; /* bitfield:
            0x02: dead;
            0x04: old;
            0x08: poisoned;
            0x10: stoned;
            0x20: paralyzed;
            0x40: possessed;
            0x80: nuts; */
/*02*/    INT16 race;   /* (enum RACE) races in order:
            human, elf, dwarf, hobbit, half-elf,
            half-orc, gnome */
/*04*/    INT16 clss;  /* (enum CLASS) classes in order: (class is a reserved word)
            warrior, paladin, rogue, bard, 
            hunter, monk, conjurer, magician,
            sorceror, wizard */
/*06*/    INT16 strength;
/*08*/    INT16 iq;
/*10*/    INT16 dexterity;
/*12*/    INT16 constitution;
/*14*/    INT16 luck;
/*16*/    INT16 mstrength;
/*18*/    INT16 miq;
/*20*/    INT16 mdexterity;
/*22*/    INT16 mconstitution;
/*24*/    INT16 mluck;
/*26*/    char skip26[2];
/*28*/    INT16 hp;
/*30*/    INT16 condition;
/*32*/    INT16 sppt;
/*34*/    INT16 msppt;
/*36*/    struct CHARITEM item[8];
/*52*/    unsigned INT32 experience;
/*56*/    unsigned INT32 gold;
/*60*/    INT16 level;
/*62*/    INT16 mlevel;
/*64*/    char sorclevel;
/*65*/    char conjlevel;
/*66*/    char magilevel;
/*67*/    char wizdlevel;
/*68*/    char hide; /*0-255 rogue chance to hide*/
/*69*/    char skip69[5];
/*74*/    INT16 crit; /*0-255 hunter odds of crit*/
/*76*/    INT16 songs;
/*78*/    char skip78[6];
/*84*/    INT16 attacks;
/*86*/    char skip86[2];
/*88*/    INT16 battles; /* battles survived */
/*90*/    char skip90[2];
};

INT16 printStatus(INT16);
INT16 printClass(INT16);
INT16 printRace(INT16);
INT16 fgetBardCharacter(struct BARDCHAR *, FILE *);
INT16 fputBardCharacter(struct BARDCHAR *, FILE *);
INT16 dumpcharacter(struct BARDCHAR *);
INT16 shortDumpChar(struct BARDCHAR *);
INT16 csvDumpChar(struct BARDCHAR *);
INT16 csvDumpHeader(void);
INT16 isBard(INT16);
INT16 isMage(INT16);
INT16 isRogue(INT16);
INT16 isHunter(INT16);
INT16 getsExtraAttacks(INT16);
#endif
