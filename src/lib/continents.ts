// Simplified continent outlines as [lat, lng] pairs in radians
// These are low-poly approximations for rendering on a 3D globe

function deg2rad(lat: number, lng: number): [number, number] {
  return [(lat * Math.PI) / 180, (lng * Math.PI) / 180];
}

// Each continent is an array of [lat, lng] coordinate pairs in radians
export const CONTINENT_OUTLINES: [number, number][][] = [
  // North America
  [
    deg2rad(49, -125), deg2rad(54, -130), deg2rad(60, -140), deg2rad(64, -165),
    deg2rad(70, -160), deg2rad(72, -155), deg2rad(71, -150), deg2rad(70, -140),
    deg2rad(69, -105), deg2rad(62, -75), deg2rad(52, -55), deg2rad(47, -53),
    deg2rad(45, -62), deg2rad(44, -66), deg2rad(41, -70), deg2rad(30, -81),
    deg2rad(25, -80), deg2rad(25, -97), deg2rad(20, -105), deg2rad(15, -92),
    deg2rad(15, -83), deg2rad(10, -84), deg2rad(8, -77), deg2rad(10, -75),
    deg2rad(10, -62), deg2rad(7, -60), deg2rad(12, -62), deg2rad(12, -70),
    deg2rad(16, -88), deg2rad(20, -90), deg2rad(21, -87), deg2rad(30, -87),
    deg2rad(29, -95), deg2rad(35, -95), deg2rad(37, -122), deg2rad(40, -124),
    deg2rad(46, -124), deg2rad(49, -125),
  ],
  // South America
  [
    deg2rad(12, -70), deg2rad(10, -75), deg2rad(8, -77), deg2rad(0, -80),
    deg2rad(-5, -81), deg2rad(-15, -75), deg2rad(-18, -70), deg2rad(-23, -70),
    deg2rad(-28, -71), deg2rad(-33, -72), deg2rad(-40, -73), deg2rad(-46, -75),
    deg2rad(-52, -70), deg2rad(-55, -68), deg2rad(-55, -65), deg2rad(-50, -65),
    deg2rad(-42, -64), deg2rad(-35, -57), deg2rad(-33, -52), deg2rad(-23, -42),
    deg2rad(-15, -39), deg2rad(-8, -35), deg2rad(-2, -42), deg2rad(2, -50),
    deg2rad(6, -57), deg2rad(7, -60), deg2rad(10, -62), deg2rad(12, -62),
    deg2rad(12, -70),
  ],
  // Europe
  [
    deg2rad(36, -6), deg2rad(37, -9), deg2rad(43, -9), deg2rad(48, -5),
    deg2rad(51, 2), deg2rad(53, 5), deg2rad(55, 8), deg2rad(57, 10),
    deg2rad(63, 10), deg2rad(65, 14), deg2rad(70, 20), deg2rad(71, 28),
    deg2rad(69, 33), deg2rad(65, 30), deg2rad(60, 30), deg2rad(56, 28),
    deg2rad(55, 21), deg2rad(54, 14), deg2rad(52, 14), deg2rad(50, 14),
    deg2rad(48, 17), deg2rad(47, 16), deg2rad(45, 14), deg2rad(42, 18),
    deg2rad(40, 20), deg2rad(38, 24), deg2rad(36, 28), deg2rad(35, 24),
    deg2rad(37, 22), deg2rad(40, 24), deg2rad(41, 27), deg2rad(42, 28),
    deg2rad(42, 29), deg2rad(44, 28), deg2rad(45, 30), deg2rad(46, 30),
    deg2rad(46, 36), deg2rad(42, 42), deg2rad(40, 44), deg2rad(40, 42),
    deg2rad(38, 35), deg2rad(37, 36), deg2rad(36, 30), deg2rad(36, 25),
    deg2rad(35, 24),
  ],
  // Africa
  [
    deg2rad(37, -1), deg2rad(36, 0), deg2rad(37, 10), deg2rad(32, 12),
    deg2rad(33, 11), deg2rad(30, 10), deg2rad(24, 12), deg2rad(20, 15),
    deg2rad(15, 18), deg2rad(12, 15), deg2rad(5, 10), deg2rad(4, 9),
    deg2rad(0, 10), deg2rad(-3, 12), deg2rad(-6, 12), deg2rad(-10, 14),
    deg2rad(-11, 24), deg2rad(-15, 28), deg2rad(-15, 30), deg2rad(-20, 35),
    deg2rad(-25, 35), deg2rad(-30, 31), deg2rad(-34, 18), deg2rad(-34, 18),
    deg2rad(-30, 17), deg2rad(-20, 13), deg2rad(-12, 14), deg2rad(-6, 12),
    deg2rad(-5, 12), deg2rad(5, 1), deg2rad(5, -4), deg2rad(4, -8),
    deg2rad(7, -13), deg2rad(10, -15), deg2rad(15, -17), deg2rad(20, -17),
    deg2rad(25, -15), deg2rad(28, -10), deg2rad(32, -5), deg2rad(35, -2),
    deg2rad(37, -1),
  ],
  // Asia (simplified)
  [
    deg2rad(42, 42), deg2rad(40, 50), deg2rad(38, 48), deg2rad(30, 48),
    deg2rad(25, 56), deg2rad(22, 60), deg2rad(25, 62), deg2rad(24, 68),
    deg2rad(28, 68), deg2rad(30, 75), deg2rad(27, 78), deg2rad(23, 70),
    deg2rad(21, 72), deg2rad(22, 80), deg2rad(16, 80), deg2rad(8, 80),
    deg2rad(6, 82), deg2rad(8, 98), deg2rad(1, 104), deg2rad(-2, 106),
    deg2rad(-6, 106), deg2rad(-8, 110), deg2rad(-8, 114), deg2rad(-6, 120),
    deg2rad(2, 110), deg2rad(7, 117), deg2rad(10, 119), deg2rad(18, 106),
    deg2rad(21, 108), deg2rad(22, 114), deg2rad(30, 122), deg2rad(35, 129),
    deg2rad(39, 127), deg2rad(43, 132), deg2rad(46, 143), deg2rad(51, 143),
    deg2rad(54, 137), deg2rad(59, 143), deg2rad(62, 150), deg2rad(63, 160),
    deg2rad(66, 170), deg2rad(65, 180), deg2rad(63, 172), deg2rad(60, 165),
    deg2rad(58, 163), deg2rad(55, 155), deg2rad(50, 155), deg2rad(52, 140),
    deg2rad(55, 135), deg2rad(55, 130), deg2rad(53, 108), deg2rad(55, 70),
    deg2rad(53, 68), deg2rad(55, 60), deg2rad(55, 50), deg2rad(50, 40),
    deg2rad(46, 36), deg2rad(42, 42),
  ],
  // Australia
  [
    deg2rad(-12, 131), deg2rad(-11, 136), deg2rad(-14, 136), deg2rad(-14, 141),
    deg2rad(-18, 146), deg2rad(-23, 150), deg2rad(-28, 153), deg2rad(-33, 152),
    deg2rad(-38, 148), deg2rad(-39, 144), deg2rad(-37, 140), deg2rad(-35, 136),
    deg2rad(-35, 117), deg2rad(-32, 115), deg2rad(-28, 114), deg2rad(-22, 114),
    deg2rad(-18, 122), deg2rad(-15, 129), deg2rad(-12, 131),
  ],
];
