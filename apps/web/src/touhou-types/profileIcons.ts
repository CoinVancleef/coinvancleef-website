/**
 * File containing profile picture icon data
 */

/**
 * Enum of available profile picture icons
 */
export enum ProfileIcon {
  // Main official games
  TH01 = 'th01',
  TH02 = 'th02',
  TH03 = 'th03',
  TH04 = 'th04',
  TH05 = 'th05',
  TH06 = 'th06',
  TH07 = 'th07',
  TH075 = 'th075',
  TH08 = 'th08',
  TH09 = 'th09',
  TH095 = 'th095',
  TH10 = 'th10',
  TH105 = 'th105',
  TH11 = 'th11',
  TH12 = 'th12',
  TH123 = 'th123',
  TH125 = 'th125',
  TH128 = 'th128',
  TH13 = 'th13',
  TH135 = 'th135',
  TH14 = 'th14',
  TH143 = 'th143',
  TH145 = 'th145',
  TH15 = 'th15',
  TH155 = 'th155',
  TH16 = 'th16',
  TH165 = 'th165',
  TH17 = 'th17',
  TH175 = 'th175',
  TH18 = 'th18',
  TH185 = 'th185',
  TH19 = 'th19',

  // Fan games
  ALCOSTG = 'alcostg',
  DYNAMARISA = 'dynamarisa',
  MEGAMARI = 'megamari',
  PATCHCON = 'patchcon',

  // Music CDs
  MCD_01 = 'mcd_01',
  MCD_02 = 'mcd_02',
  MCD_03 = 'mcd_03',
  MCD_04 = 'mcd_04',
  MCD_05 = 'mcd_05',
  MCD_055 = 'mcd_055',
  MCD_06 = 'mcd_06',
  MCD_07 = 'mcd_07',
  MCD_08 = 'mcd_08',
  MCD_09 = 'mcd_09',
  MCD_BAIJR = 'mcd_baijr',
  MCD_FAIRY02 = 'mcd_fairy02',
  MCD_FAIRY04 = 'mcd_fairy04',
  MCD_FAIRY06 = 'mcd_fairy06',
  MCD_GOM = 'mcd_gom',
  MCD_FS = 'mcd_fs',
  MCD_SSIB = 'mcd_ssib',
}

/**
 * URL mapping for profile icons
 */
export const PROFILE_ICON_URLS: Record<ProfileIcon, string> = {
  [ProfileIcon.TH01]:
    'https://en.touhouwiki.net/images/archive/1/11/20241007172320%21Icon_th01.png',
  [ProfileIcon.TH02]:
    'https://en.touhouwiki.net/images/archive/9/9f/20241007181645%21Icon_th02.png',
  [ProfileIcon.TH03]:
    'https://en.touhouwiki.net/images/archive/f/f8/20241007181723%21Icon_th03.png',
  [ProfileIcon.TH04]:
    'https://en.touhouwiki.net/images/archive/6/6d/20241007181747%21Icon_th04.png',
  [ProfileIcon.TH05]: 'https://www.thpatch.net/w/images/d/dd/Icon_th05.png',
  [ProfileIcon.TH06]:
    'https://en.touhouwiki.net/images/archive/c/c9/20140814021505%21Icon_th06.png',
  [ProfileIcon.TH07]:
    'https://en.touhouwiki.net/images/archive/2/24/20241007181828%21Icon_th07.png',
  [ProfileIcon.TH075]:
    'https://en.touhouwiki.net/images/archive/f/f6/20241007182618%21Icon_th075.png',
  [ProfileIcon.TH08]:
    'https://en.touhouwiki.net/images/archive/6/63/20241007181845%21Icon_th08.png',
  [ProfileIcon.TH09]:
    'https://en.touhouwiki.net/images/archive/4/43/20241007181857%21Icon_th09.png',
  [ProfileIcon.TH095]:
    'https://en.touhouwiki.net/images/archive/8/84/20241007182629%21Icon_th095.png',
  [ProfileIcon.TH10]:
    'https://en.touhouwiki.net/images/archive/b/b6/20241007181907%21Icon_th10.png',
  [ProfileIcon.TH105]:
    'https://en.touhouwiki.net/images/archive/2/20/20241007182640%21Icon_th105.png',
  [ProfileIcon.TH11]:
    'https://en.touhouwiki.net/images/archive/c/c1/20241007181918%21Icon_th11.png',
  [ProfileIcon.TH12]:
    'https://en.touhouwiki.net/images/archive/7/7f/20241007181928%21Icon_th12.png',
  [ProfileIcon.TH123]:
    'https://en.touhouwiki.net/images/archive/6/6d/20241007182651%21Icon_th123.png',
  [ProfileIcon.TH125]:
    'https://en.touhouwiki.net/images/archive/4/49/20241007182702%21Icon_th125.png',
  [ProfileIcon.TH128]:
    'https://en.touhouwiki.net/images/archive/b/b4/20241007182711%21Icon_th128.png',
  [ProfileIcon.TH13]:
    'https://en.touhouwiki.net/images/archive/f/fe/20241007182000%21Icon_th13.png',
  [ProfileIcon.TH135]:
    'https://en.touhouwiki.net/images/archive/c/cc/20140814021723%21Icon_th135.png',
  [ProfileIcon.TH14]:
    'https://en.touhouwiki.net/images/archive/2/21/20130615110646%21Icon_th14.png',
  [ProfileIcon.TH143]: 'https://en.touhouwiki.net/images/0/09/Icon_th143.png',
  [ProfileIcon.TH145]:
    'https://en.touhouwiki.net/images/archive/a/a9/20241007182745%21Icon_th145.png',
  [ProfileIcon.TH15]:
    'https://en.touhouwiki.net/images/archive/7/79/20250227215605%21Icon_th15.png',
  [ProfileIcon.TH155]: 'https://www.thpatch.net/w/images/3/35/Icon_th155.png',
  [ProfileIcon.TH16]: 'https://www.thpatch.net/w/images/d/da/Icon_th16.png',
  [ProfileIcon.TH165]: 'https://www.thpatch.net/w/images/3/32/Icon_th165.png',
  [ProfileIcon.TH17]: 'https://www.thpatch.net/w/images/8/84/Icon_th17.png',
  [ProfileIcon.TH175]: 'https://www.thpatch.net/w/images/c/cc/Icon_th175.png',
  [ProfileIcon.TH18]: 'https://www.thpatch.net/w/images/3/3e/Icon_th18.png',
  [ProfileIcon.TH185]: 'https://www.thpatch.net/w/images/2/25/Icon_th185.png',
  [ProfileIcon.TH19]: 'https://www.thpatch.net/w/images/5/55/Icon_th19.png',

  // Fan games
  [ProfileIcon.ALCOSTG]: 'https://en.touhouwiki.net/images/a/ab/Icon_alcostg.png',
  [ProfileIcon.DYNAMARISA]: 'https://en.touhouwiki.net/images/3/37/Icon_dynamarisa.png',
  [ProfileIcon.MEGAMARI]: 'https://en.touhouwiki.net/images/6/6a/Icon_megamari.png',
  [ProfileIcon.PATCHCON]: 'https://en.touhouwiki.net/images/8/82/Icon_patchcon.png',

  // Music CDs
  [ProfileIcon.MCD_01]: 'https://www.thpatch.net/w/images/a/ad/Icon_mcd_01.png',
  [ProfileIcon.MCD_02]: 'https://www.thpatch.net/w/images/f/f0/Icon_mcd_02.png',
  [ProfileIcon.MCD_03]: 'https://www.thpatch.net/w/images/4/46/Icon_mcd_03.png',
  [ProfileIcon.MCD_04]: 'https://www.thpatch.net/w/images/8/80/Icon_mcd_04.png',
  [ProfileIcon.MCD_05]: 'https://www.thpatch.net/w/images/9/97/Icon_mcd_05.png',
  [ProfileIcon.MCD_055]: 'https://www.thpatch.net/w/images/a/a4/Icon_mcd_055.png',
  [ProfileIcon.MCD_06]: 'https://www.thpatch.net/w/images/a/ac/Icon_mcd_06.png',
  [ProfileIcon.MCD_07]: 'https://www.thpatch.net/w/images/2/26/Icon_mcd_07.png',
  [ProfileIcon.MCD_08]: 'https://www.thpatch.net/w/images/c/c6/Icon_mcd_08.png',
  [ProfileIcon.MCD_09]: 'https://www.thpatch.net/w/images/2/27/Icon_mcd_09.png',
  [ProfileIcon.MCD_BAIJR]: 'https://www.thpatch.net/w/images/8/8b/Icon_mcd_baijr.png',
  [ProfileIcon.MCD_FAIRY02]: 'https://www.thpatch.net/w/images/d/d3/Icon_mcd_fairy02.png',
  [ProfileIcon.MCD_FAIRY04]: 'https://www.thpatch.net/w/images/0/06/Icon_mcd_fairy04.png',
  [ProfileIcon.MCD_FAIRY06]: 'https://www.thpatch.net/w/images/3/39/Icon_mcd_fairy06.png',
  [ProfileIcon.MCD_GOM]: 'https://www.thpatch.net/w/images/4/4f/Icon_mcd_gom.png',
  [ProfileIcon.MCD_FS]: 'https://www.thpatch.net/w/images/d/d8/Icon_mcd_fs.png',
  [ProfileIcon.MCD_SSIB]: 'https://www.thpatch.net/w/images/a/a6/Icon_mcd_ssib.png',
};

/**
 * Display names for profile icons
 */
export const PROFILE_ICON_NAMES: Record<ProfileIcon, string> = {
  [ProfileIcon.TH01]: 'Highly Responsive to Prayers',
  [ProfileIcon.TH02]: 'Story of Eastern Wonderland',
  [ProfileIcon.TH03]: 'Phantasmagoria of Dim.Dream',
  [ProfileIcon.TH04]: 'Lotus Land Story',
  [ProfileIcon.TH05]: 'Mystic Square',
  [ProfileIcon.TH06]: 'Embodiment of Scarlet Devil',
  [ProfileIcon.TH07]: 'Perfect Cherry Blossom',
  [ProfileIcon.TH075]: 'Immaterial and Missing Power',
  [ProfileIcon.TH08]: 'Imperishable Night',
  [ProfileIcon.TH09]: 'Phantasmagoria of Flower View',
  [ProfileIcon.TH095]: 'Shoot the Bullet',
  [ProfileIcon.TH10]: 'Mountain of Faith',
  [ProfileIcon.TH105]: 'Scarlet Weather Rhapsody',
  [ProfileIcon.TH11]: 'Subterranean Animism',
  [ProfileIcon.TH12]: 'Undefined Fantastic Object',
  [ProfileIcon.TH123]: 'Hisoutensoku',
  [ProfileIcon.TH125]: 'Double Spoiler',
  [ProfileIcon.TH128]: 'Great Fairy Wars',
  [ProfileIcon.TH13]: 'Ten Desires',
  [ProfileIcon.TH135]: 'Hopeless Masquerade',
  [ProfileIcon.TH14]: 'Double Dealing Character',
  [ProfileIcon.TH143]: 'Impossible Spell Card',
  [ProfileIcon.TH145]: 'Urban Legend in Limbo',
  [ProfileIcon.TH15]: 'Legacy of Lunatic Kingdom',
  [ProfileIcon.TH155]: 'Antinomy of Common Flowers',
  [ProfileIcon.TH16]: 'Hidden Star in Four Seasons',
  [ProfileIcon.TH165]: 'Violet Detector',
  [ProfileIcon.TH17]: 'Wily Beast and Weakest Creature',
  [ProfileIcon.TH175]: 'Sunken Fossil World',
  [ProfileIcon.TH18]: 'Unconnected Marketeers',
  [ProfileIcon.TH185]: 'Hundred Ghostly Scheme Stories',
  [ProfileIcon.TH19]: 'Phantasmal Destroyer',

  // Fan games
  [ProfileIcon.ALCOSTG]: 'Uwabami Breakers',
  [ProfileIcon.DYNAMARISA]: 'Dynamite Marisa',
  [ProfileIcon.MEGAMARI]: 'MegaMari',
  [ProfileIcon.PATCHCON]: 'Patchcon',

  // Music CDs
  [ProfileIcon.MCD_01]: 'Dolls in Pseudo Paradise',
  [ProfileIcon.MCD_02]: 'Ghostly Field Club',
  [ProfileIcon.MCD_03]: 'Retrospective 53 minutes',
  [ProfileIcon.MCD_04]: 'Mystic Square CD',
  [ProfileIcon.MCD_05]: 'Lotus Land Story CD',
  [ProfileIcon.MCD_055]: 'Magical Astronomy',
  [ProfileIcon.MCD_06]: 'Mysterious Gensokyo',
  [ProfileIcon.MCD_07]: 'Perfect Cherry Blossom CD',
  [ProfileIcon.MCD_08]: 'Imperishable Night CD',
  [ProfileIcon.MCD_09]: 'Phantasmagoria of Flower View CD',
  [ProfileIcon.MCD_BAIJR]: 'Baijr CD',
  [ProfileIcon.MCD_FAIRY02]: 'Fairy Wars CD 2',
  [ProfileIcon.MCD_FAIRY04]: 'Fairy Wars CD 4',
  [ProfileIcon.MCD_FAIRY06]: 'Fairy Wars CD 6',
  [ProfileIcon.MCD_GOM]: 'Grimoire of Marisa',
  [ProfileIcon.MCD_FS]: 'Fairy Storage',
  [ProfileIcon.MCD_SSIB]: 'Strange Creators of Outer World',
};
