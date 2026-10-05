-- =====================================================================
--  Navi: Campus Navigation Web App
--  Cavite State University – Cavite City Campus
--  Database: navi_db  (import this file in phpMyAdmin → Import)
-- =====================================================================

SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS navi_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE navi_db;

DROP TABLE IF EXISTS destinations;
DROP TABLE IF EXISTS admins;

-- ---------------------------------------------------------------------
--  Campus destinations (rooms, offices, facilities, exits)
--  floor : 1 = Ground Floor (includes the campus grounds), 2 = Second Floor
--  x, y, w, h       : rectangle of the place on that floor's map
--  door_x, door_y   : point where the place meets the hallway (used for routes)
-- ---------------------------------------------------------------------
CREATE TABLE destinations (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(120) NOT NULL,
  category     VARCHAR(40)  NOT NULL,
  floor        TINYINT UNSIGNED NOT NULL DEFAULT 1,
  description  TEXT NULL,
  keywords     VARCHAR(255) NULL,
  office_hours VARCHAR(120) NULL,
  x            SMALLINT NOT NULL,
  y            SMALLINT NOT NULL,
  w            SMALLINT NOT NULL,
  h            SMALLINT NOT NULL,
  door_x       SMALLINT NULL,
  door_y       SMALLINT NULL,
  is_active    TINYINT(1) NOT NULL DEFAULT 1,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_floor (floor),
  INDEX idx_category (category)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
--  Administrators (campus staff / team members who update destinations)
--  Default login →  username: admin   password: navi2026
--  CHANGE THE PASSWORD after the first login (Admin → Change Password).
-- ---------------------------------------------------------------------
CREATE TABLE admins (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO admins (username, password_hash) VALUES
('admin', '$2y$10$lq13vK70LQXSprWOOIPTCuqpBmNdwuLLRkv.xkzjzjE1CxLZYVuZy');

-- ---------------------------------------------------------------------
--  GROUND FLOOR  (based on the "CvSU-CCC Ground Site Map" and the
--  "As-Built Ground Floor Plan" evacuation maps)
-- ---------------------------------------------------------------------
INSERT INTO destinations
(name, category, floor, description, keywords, office_hours, x, y, w, h, door_x, door_y) VALUES
-- Gates & exits
('Main Gate', 'Entrance/Exit', 1, 'Main entrance gate of the campus along Manila–Cavite Road, in front of the main building.', 'gate entrance entry front', NULL, 798, 1758, 75, 24, 835, 1770),
('West Gate', 'Entrance/Exit', 1, 'Gate on the west side of the front grounds.', 'gate entrance entry', NULL, 368, 1758, 75, 24, 405, 1770),
('East Gate', 'Entrance/Exit', 1, 'Gate on the east side of the front grounds, near the Guard House.', 'gate entrance entry', NULL, 1218, 1758, 75, 24, 1255, 1770),
('Main Entrance / Lobby', 'Entrance/Exit', 1, 'Front door of the main building. The lobby hallway leads straight to the Registrar and the Quadrangle.', 'lobby main door front exit', NULL, 805, 1462, 60, 30, 835, 1480),
('North Exit (to Quadrangle)', 'Entrance/Exit', 1, 'Exit at the end of the lobby hallway that opens to the Quadrangle.', 'exit quadrangle garden', NULL, 805, 1060, 60, 22, 835, 1072),
('West Fire Exit', 'Entrance/Exit', 1, 'Emergency exit at the north end of the west hallway, beside the stairs.', 'fire exit emergency evacuation', NULL, 392, 846, 40, 22, 412, 858),
('East Fire Exit', 'Entrance/Exit', 1, 'Emergency exit at the east end of the main hallway, near the east stairs.', 'fire exit emergency evacuation', NULL, 1347, 1262, 26, 34, 1360, 1278),

-- Facilities
('Guard House', 'Facility', 1, 'Security guard house near the East Gate. Ask the guard for visitor passes and help.', 'security guard visitor pass', 'Open 24 hours', 1325, 1655, 85, 90, 1325, 1700),
('Quadrangle (Garden & Fountain)', 'Facility', 1, 'Open-air garden with a fountain at the center of the campus, behind the lobby.', 'garden fountain quadrangle open area', NULL, 720, 765, 170, 280, 805, 900),
('Canteen', 'Facility', 1, 'Campus canteen in the east block, beside the Quadrangle.', 'food cafeteria eat lunch snacks', 'Mon–Sat, 7:00 AM – 6:00 PM', 948, 855, 397, 120, 1100, 975),
('Clinic', 'Facility', 1, 'Campus health clinic for first aid and medical assistance.', 'health nurse medical first aid infirmary', 'Mon–Fri, 8:00 AM – 5:00 PM', 1155, 720, 100, 95, 1205, 720),
('Student Lounge (East Block)', 'Facility', 1, 'Student lounge beside the Canteen, facing Rm. 103.', 'lounge rest waiting area', NULL, 945, 1030, 105, 35, 945, 1048),
('Student Lounge A', 'Facility', 1, 'Student lounge along the north grounds.', 'lounge rest waiting area', NULL, 870, 430, 42, 50, 891, 480),
('Student Lounge B', 'Facility', 1, 'Student lounge along the north grounds.', 'lounge rest waiting area', NULL, 1015, 430, 42, 50, 1036, 480),
('Student Lounge C', 'Facility', 1, 'Student lounge along the north grounds.', 'lounge rest waiting area', NULL, 1140, 430, 42, 50, 1161, 480),

-- Restrooms
('Men''s Comfort Room (North Grounds)', 'Restroom', 1, 'Men''s restroom at the north-east corner of the campus grounds.', 'cr toilet restroom male boys', NULL, 1258, 415, 84, 42, 1300, 457),
('Women''s Comfort Room (North Grounds)', 'Restroom', 1, 'Women''s restroom at the north-east corner of the campus grounds.', 'cr toilet restroom female girls ladies', NULL, 1344, 415, 82, 42, 1385, 457),
('Ladies'' Comfort Room (Ground Floor)', 'Restroom', 1, 'Ladies'' restroom at the east end of the main building, beside the Records Room.', 'cr toilet restroom female girls', NULL, 1265, 1075, 80, 150, 1305, 1225),

-- Offices
('Registrar''s Office', 'Office', 1, 'Request of records, TOR, certifications and enrollment documents. Located along the lobby hallway, left side when coming from the Main Entrance.', 'registrar records tor certificate enrollment documents', 'Mon–Fri, 8:00 AM – 5:00 PM', 728, 1085, 64, 75, 792, 1122),
('Accounting Office', 'Office', 1, 'Payments, assessments and financial transactions. Beside the Registrar''s Office.', 'accounting cashier payment fees assessment', 'Mon–Fri, 8:00 AM – 5:00 PM', 728, 1165, 64, 75, 792, 1200),
('Administration Office', 'Office', 1, 'Office of the campus administration. Near the Main Entrance, left side of the lobby.', 'admin administration dean office', 'Mon–Fri, 8:00 AM – 5:00 PM', 720, 1410, 80, 80, 800, 1450),
('Support Staff Office', 'Office', 1, 'Office of the campus support staff, along the main hallway.', 'support staff', 'Mon–Fri, 8:00 AM – 5:00 PM', 720, 1320, 80, 90, 760, 1320),
('Quality Assurance Office', 'Office', 1, 'Quality assurance and accreditation office.', 'quacc qa quality accreditation', 'Mon–Fri, 8:00 AM – 5:00 PM', 640, 1385, 75, 105, 677, 1385),
('Testing Office', 'Office', 1, 'Testing and admission examination office.', 'testing exam admission entrance test nstp', 'Mon–Fri, 8:00 AM – 5:00 PM', 640, 1320, 75, 65, 677, 1320),
('Office of Student Affairs and Services (OSAS)', 'Office', 1, 'Student affairs, IDs, scholarships and student concerns.', 'osas student affairs id scholarship', 'Mon–Fri, 8:00 AM – 5:00 PM', 475, 1375, 75, 115, 512, 1375),
('CSG Office', 'Office', 1, 'Office of the Central Student Government.', 'csg student government council', NULL, 475, 1320, 75, 55, 512, 1320),
('Guidance Office', 'Office', 1, 'Guidance and counseling services for students.', 'guidance counselor', 'Mon–Fri, 8:00 AM – 5:00 PM', 388, 1320, 74, 90, 425, 1320),
('Counseling Area', 'Office', 1, 'Private counseling area inside the Guidance Office.', 'counseling guidance', 'Mon–Fri, 8:00 AM – 5:00 PM', 388, 1410, 74, 80, 425, 1410),
('MIS Office', 'Office', 1, 'Management Information Systems office (student portal, accounts, IT support).', 'mis portal it support accounts', 'Mon–Fri, 8:00 AM – 5:00 PM', 610, 1160, 85, 80, 652, 1240),
('RDE Office', 'Office', 1, 'Research, Development and Extension office.', 'rde research extension', 'Mon–Fri, 8:00 AM – 5:00 PM', 1105, 1075, 100, 150, 1155, 1225),
('Records Room', 'Office', 1, 'Records storage room beside the RDE Office.', 'records files archive', NULL, 1205, 1075, 60, 150, 1235, 1225),
('Publications Office', 'Office', 1, 'Office of the student publication.', 'publication newspaper journalism', NULL, 1257, 720, 88, 70, 1300, 720),
('Property & Supply Office', 'Office', 1, 'Property and supply office at the south-west corner of the main building.', 'property supply', 'Mon–Fri, 8:00 AM – 5:00 PM', 248, 1255, 137, 235, 385, 1290),
('HRM Stockroom', 'Office', 1, 'Stockroom of the Hospitality Management laboratories.', 'hrm hm stockroom supplies', NULL, 610, 1080, 85, 55, 695, 1107),

-- Departments
('Information Technology Department', 'Department', 1, 'Faculty office of the Department of Information Technology.', 'it department faculty bsit computer', 'Mon–Fri, 8:00 AM – 5:00 PM', 450, 1160, 150, 80, 525, 1240),
('Management Department', 'Department', 1, 'Faculty office of the Management Department (east block).', 'management department faculty business', 'Mon–Fri, 8:00 AM – 5:00 PM', 948, 720, 110, 135, 1003, 720),

-- Laboratories
('HRM Laboratory – Cold Kitchen', 'Laboratory', 1, 'Hospitality management cold kitchen laboratory, west wing.', 'hrm hm kitchen cold cooking', NULL, 248, 920, 137, 165, 385, 1000),
('HRM Laboratory – Hot Kitchen', 'Laboratory', 1, 'Hospitality management hot kitchen laboratory, west wing.', 'hrm hm kitchen hot cooking', NULL, 248, 1085, 137, 170, 385, 1170),
('Housekeeping Laboratory', 'Laboratory', 1, 'Housekeeping laboratory for hospitality management students.', 'housekeeping hrm hm', NULL, 450, 840, 122, 130, 450, 900),
('Hotel El Chabacano', 'Laboratory', 1, 'Mock hotel laboratory of the Hospitality Management program.', 'hotel mock room hrm hm chabacano', NULL, 450, 985, 90, 95, 495, 985),
('Chabacano Extension', 'Laboratory', 1, 'Extension of the Hotel El Chabacano laboratory.', 'hotel hrm hm chabacano extension', NULL, 575, 985, 115, 95, 632, 985),
('Bar Management Laboratory', 'Laboratory', 1, 'Bar management laboratory and front office training room.', 'bar front office hrm hm', NULL, 450, 1080, 160, 80, 450, 1120),
('New Lab 1 (Computer Laboratory 1)', 'Laboratory', 1, 'Computer Laboratory 1 / Multimedia Laboratory at the east end of the main hallway.', 'computer lab 1 comlab multimedia new lab', NULL, 1100, 1315, 170, 165, 1185, 1315),
('New Lab 2 (Computer Laboratory 2 / AVR)', 'Laboratory', 1, 'Computer Laboratory 2, also used as the Audio-Visual Room (AVR).', 'computer lab 2 comlab avr audio visual new lab', NULL, 935, 1315, 165, 165, 1017, 1315),

-- Classrooms
('Rm. 103', 'Classroom', 1, 'Classroom on the ground floor, east of the central stairs.', 'room 103 classroom', NULL, 945, 1075, 160, 150, 1025, 1225),
('Rm. 104B (Computer Laboratory 4)', 'Classroom', 1, 'Room 104B / Computer Laboratory 4, right side of the lobby near the Main Entrance.', 'room 104b computer lab 4 comlab', NULL, 875, 1315, 60, 165, 875, 1400),
('Rm. 114A (Computer Laboratory 5)', 'Classroom', 1, 'Room 114A / Computer Laboratory 5, along the main hallway.', 'room 114a computer lab 5 comlab', NULL, 553, 1320, 85, 170, 595, 1320);

-- ---------------------------------------------------------------------
--  SECOND FLOOR  (based on the "CvSU-CCC Second Floor Emergency Exit Plan")
--  NOTE: room numbers were read from a photo of the posted plan –
--  please verify them on site and correct them in the Admin panel.
-- ---------------------------------------------------------------------
INSERT INTO destinations
(name, category, floor, description, keywords, office_hours, x, y, w, h, door_x, door_y) VALUES
('Library', 'Facility', 2, 'Campus library on the second floor, west wing. Take the west or central stairs.', 'library books reading study', 'Mon–Fri, 8:00 AM – 5:00 PM', 208, 220, 168, 256, 290, 476),
('Library Extension', 'Facility', 2, 'Extension reading area of the library.', 'library extension reading study', 'Mon–Fri, 8:00 AM – 5:00 PM', 216, 92, 112, 128, 216, 160),
('Comfort Room (Second Floor)', 'Restroom', 2, 'Restroom at the east end of the second floor.', 'cr toilet restroom', NULL, 1064, 324, 96, 168, 1112, 492),
('Chemistry/Physics Laboratory', 'Laboratory', 2, 'Science laboratory at the south-west corner of the second floor.', 'chemistry physics science lab', NULL, 40, 476, 112, 224, 152, 560),
('Department of Teacher Education and Languages', 'Department', 2, 'Faculty office of the Department of Teacher Education and Languages.', 'teacher education languages faculty department', 'Mon–Fri, 8:00 AM – 5:00 PM', 152, 604, 76, 192, 190, 604),
('Department of Arts and Sciences', 'Department', 2, 'Faculty office of the Department of Arts and Sciences.', 'arts sciences faculty department', 'Mon–Fri, 8:00 AM – 5:00 PM', 228, 604, 76, 192, 266, 604),
('RM 201', 'Classroom', 2, 'Second floor classroom, north side of the hallway.', 'room 201 classroom', NULL, 952, 324, 112, 168, 1008, 492),
('RM 202', 'Classroom', 2, 'Second floor classroom, south side of the hallway.', 'room 202 classroom', NULL, 1000, 604, 72, 192, 1036, 604),
('RM 203', 'Classroom', 2, 'Second floor classroom, north side of the hallway.', 'room 203 classroom', NULL, 808, 324, 144, 168, 880, 492),
('RM 204', 'Classroom', 2, 'Second floor classroom, south side of the hallway.', 'room 204 classroom', NULL, 896, 604, 104, 192, 948, 604),
('RM 205', 'Classroom', 2, 'Second floor classroom, right beside the central stairs.', 'room 205 classroom', NULL, 704, 324, 104, 168, 756, 492),
('RM 206', 'Classroom', 2, 'Second floor classroom, south side of the hallway.', 'room 206 classroom', NULL, 760, 604, 136, 192, 828, 604),
('RM 207', 'Classroom', 2, 'Second floor classroom, left of the central stairs.', 'room 207 classroom', NULL, 544, 324, 88, 168, 588, 492),
('RM 208', 'Classroom', 2, 'Second floor classroom, south side of the hallway.', 'room 208 classroom', NULL, 656, 604, 104, 192, 708, 604),
('RM 209', 'Classroom', 2, 'Second floor classroom, north side of the hallway.', 'room 209 classroom', NULL, 464, 324, 80, 168, 504, 492),
('RM 210', 'Classroom', 2, 'Second floor classroom, south side of the hallway.', 'room 210 classroom', NULL, 560, 604, 96, 192, 608, 604),
('RM 211', 'Classroom', 2, 'Second floor classroom beside the Library.', 'room 211 classroom', NULL, 376, 324, 88, 168, 420, 492),
('RM 212', 'Classroom', 2, 'Second floor classroom beside the south exit stairs.', 'room 212 classroom', NULL, 504, 604, 56, 192, 532, 604),
('RM 213', 'Classroom', 2, 'Second floor classroom, south side of the hallway.', 'room 213 classroom', NULL, 400, 604, 72, 192, 436, 604),
('RM 214', 'Classroom', 2, 'Second floor classroom, south side of the hallway.', 'room 214 classroom', NULL, 320, 604, 80, 192, 360, 604),
('RM 215', 'Classroom', 2, 'Second floor classroom along the west hallway.', 'room 215 classroom', NULL, 40, 348, 109, 128, 149, 412),
('RM 216', 'Classroom', 2, 'Second floor classroom along the west hallway.', 'room 216 classroom', NULL, 40, 236, 109, 112, 149, 292),
('RM 217', 'Classroom', 2, 'Second floor classroom along the west hallway, near the west fire exit.', 'room 217 classroom', NULL, 40, 132, 109, 104, 149, 184),
('West Fire Exit (Second Floor)', 'Entrance/Exit', 2, 'Emergency exit stairs at the north end of the west hallway.', 'fire exit emergency evacuation stairs', NULL, 112, 30, 72, 40, 148, 50),
('South Exit Stairs (Second Floor)', 'Entrance/Exit', 2, 'Exit stairs beside RM 212 going down to the front of the building.', 'exit stairs emergency evacuation', NULL, 456, 796, 80, 36, 488, 796),
('East Fire Exit (Second Floor)', 'Entrance/Exit', 2, 'Emergency exit at the east end of the second floor hallway.', 'fire exit emergency evacuation', NULL, 1160, 520, 30, 56, 1175, 548);
