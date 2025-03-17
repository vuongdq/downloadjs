const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Software = require('./models/Software');
const dotenv = require('dotenv');

dotenv.config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

// Dữ liệu mẫu Users
const users = [
  { username: 'admin', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { username: 'john_doe', email: 'john.doe@example.com', password: 'password123', role: 'user' },
  { username: 'jane_smith', email: 'jane.smith@example.com', password: 'password123', role: 'user' },
  { username: 'mike_jones', email: 'mike.jones@example.com', password: 'password123', role: 'user' },
  { username: 'sarah_lee', email: 'sarah.lee@example.com', password: 'password123', role: 'user' },
  { username: 'peter_parker', email: 'peter.parker@example.com', password: 'password123', role: 'user' },
  { username: 'linda_brown', email: 'linda.brown@example.com', password: 'password123', role: 'user' },
  { username: 'david_wilson', email: 'david.wilson@example.com', password: 'password123', role: 'user' },
  { username: 'emily_clark', email: 'emily.clark@example.com', password: 'password123', role: 'user' },
  { username: 'chris_evans', email: 'chris.evans@example.com', password: 'password123', role: 'user' },
];

// Dữ liệu mẫu Categories
const categories = [
  { name: 'Productivity Tools', description: 'Software to enhance productivity and workflow' },
  { name: 'Graphic Design', description: 'Tools for creating and editing graphics' },
  { name: 'Video Editing', description: 'Software for video editing and production' },
  { name: 'Gaming', description: 'Games for entertainment across platforms' },
  { name: 'Development Tools', description: 'Tools for coding and software development' },
  { name: 'Education', description: 'Applications for learning and education' },
  { name: 'Security', description: 'Software to protect your system and data' },
  { name: 'Communication', description: 'Tools for messaging and video calls' },
  { name: 'Media Players', description: 'Applications for playing audio and video' },
  { name: 'Utilities', description: 'Miscellaneous tools for system management' },
];

// Dữ liệu mẫu Softwares (mỗi category có 10-20 phần mềm)
const softwares = [
  // Productivity Tools (15 phần mềm)
  { title: 'Microsoft Office', description: 'Suite of productivity apps', category: null, downloadLink: 'https://www.microsoft.com/office' },
  { title: 'Google Docs', description: 'Online document editor', category: null, downloadLink: 'https://docs.google.com' },
  { title: 'Notion', description: 'All-in-one workspace', category: null, downloadLink: 'https://www.notion.so' },
  { title: 'Trello', description: 'Project management tool', category: null, downloadLink: 'https://trello.com' },
  { title: 'Slack', description: 'Team collaboration platform', category: null, downloadLink: 'https://slack.com' },
  { title: 'Evernote', description: 'Note-taking app', category: null, downloadLink: 'https://evernote.com' },
  { title: 'Todoist', description: 'Task management app', category: null, downloadLink: 'https://todoist.com' },
  { title: 'Asana', description: 'Work management platform', category: null, downloadLink: 'https://asana.com' },
  { title: 'Zoom', description: 'Video conferencing tool', category: null, downloadLink: 'https://zoom.us' },
  { title: 'Dropbox', description: 'Cloud storage service', category: null, downloadLink: 'https://www.dropbox.com' },
  { title: 'OneNote', description: 'Digital note-taking app', category: null, downloadLink: 'https://www.onenote.com' },
  { title: 'Monday.com', description: 'Team management software', category: null, downloadLink: 'https://monday.com' },
  { title: 'Airtable', description: 'Spreadsheet-database hybrid', category: null, downloadLink: 'https://airtable.com' },
  { title: 'ClickUp', description: 'All-in-one productivity tool', category: null, downloadLink: 'https://clickup.com' },
  { title: 'Zapier', description: 'Automation tool', category: null, downloadLink: 'https://zapier.com' },

  // Graphic Design (12 phần mềm)
  { title: 'Adobe Photoshop', description: 'Professional image editing', category: null, downloadLink: 'https://www.adobe.com/photoshop' },
  { title: 'Adobe Illustrator', description: 'Vector graphics editor', category: null, downloadLink: 'https://www.adobe.com/illustrator' },
  { title: 'Canva', description: 'Online design tool', category: null, downloadLink: 'https://www.canva.com' },
  { title: 'GIMP', description: 'Free image editor', category: null, downloadLink: 'https://www.gimp.org' },
  { title: 'Inkscape', description: 'Free vector graphics editor', category: null, downloadLink: 'https://inkscape.org' },
  { title: 'CorelDRAW', description: 'Graphic design suite', category: null, downloadLink: 'https://www.coreldraw.com' },
  { title: 'Figma', description: 'Collaborative design tool', category: null, downloadLink: 'https://www.figma.com' },
  { title: 'Sketch', description: 'Design tool for macOS', category: null, downloadLink: 'https://www.sketch.com' },
  { title: 'Affinity Designer', description: 'Vector and raster design', category: null, downloadLink: 'https://affinity.serif.com' },
  { title: 'Photopea', description: 'Online Photoshop alternative', category: null, downloadLink: 'https://www.photopea.com' },
  { title: 'Krita', description: 'Digital painting software', category: null, downloadLink: 'https://krita.org' },
  { title: 'Gravit Designer', description: 'Web-based design tool', category: null, downloadLink: 'https://www.designer.io' },

  // Video Editing (10 phần mềm)
  { title: 'Adobe Premiere Pro', description: 'Professional video editing', category: null, downloadLink: 'https://www.adobe.com/premiere' },
  { title: 'Final Cut Pro', description: 'Video editing for macOS', category: null, downloadLink: 'https://www.apple.com/final-cut-pro' },
  { title: 'DaVinci Resolve', description: 'Color correction and editing', category: null, downloadLink: 'https://www.blackmagicdesign.com' },
  { title: 'Filmora', description: 'Easy video editing', category: null, downloadLink: 'https://filmora.wondershare.com' },
  { title: 'iMovie', description: 'Free video editing for macOS', category: null, downloadLink: 'https://www.apple.com/imovie' },
  { title: 'Vegas Pro', description: 'Advanced video editing', category: null, downloadLink: 'https://www.vegascreativesoftware.com' },
  { title: 'Shotcut', description: 'Free open-source editor', category: null, downloadLink: 'https://shotcut.org' },
  { title: 'HitFilm Express', description: 'Free video editing and VFX', category: null, downloadLink: 'https://fxhome.com/hitfilm-express' },
  { title: 'Blender', description: '3D creation with video editing', category: null, downloadLink: 'https://www.blender.org' },
  { title: 'OpenShot', description: 'Simple open-source editor', category: null, downloadLink: 'https://www.openshot.org' },

  // Gaming (14 phần mềm)
  { title: 'Minecraft', description: 'Sandbox adventure game', category: null, downloadLink: 'https://www.minecraft.net' },
  { title: 'Fortnite', description: 'Battle royale game', category: null, downloadLink: 'https://www.epicgames.com/fortnite' },
  { title: 'Among Us', description: 'Multiplayer party game', category: null, downloadLink: 'https://www.innersloth.com' },
  { title: 'Counter-Strike: GO', description: 'First-person shooter', category: null, downloadLink: 'https://store.steampowered.com/app/730' },
  { title: 'League of Legends', description: 'MOBA game', category: null, downloadLink: 'https://www.leagueoflegends.com' },
  { title: 'Dota 2', description: 'Multiplayer online battle arena', category: null, downloadLink: 'https://www.dota2.com' },
  { title: 'The Sims 4', description: 'Life simulation game', category: null, downloadLink: 'https://www.ea.com/games/the-sims' },
  { title: 'GTA V', description: 'Open-world action game', category: null, downloadLink: 'https://www.rockstargames.com' },
  { title: 'Overwatch', description: 'Team-based shooter', category: null, downloadLink: 'https://playoverwatch.com' },
  { title: 'Stardew Valley', description: 'Farming simulation', category: null, downloadLink: 'https://www.stardewvalley.net' },
  { title: 'Cyberpunk 2077', description: 'Open-world RPG', category: null, downloadLink: 'https://www.cyberpunk.net' },
  { title: 'Apex Legends', description: 'Battle royale shooter', category: null, downloadLink: 'https://www.ea.com/games/apex-legends' },
  { title: 'Fall Guys', description: 'Party battle royale', category: null, downloadLink: 'https://fallguys.com' },
  { title: 'Rocket League', description: 'Soccer with cars', category: null, downloadLink: 'https://www.rocketleague.com' },

  // Development Tools (13 phần mềm)
  { title: 'Visual Studio Code', description: 'Code editor', category: null, downloadLink: 'https://code.visualstudio.com' },
  { title: 'IntelliJ IDEA', description: 'Java IDE', category: null, downloadLink: 'https://www.jetbrains.com/idea' },
  { title: 'PyCharm', description: 'Python IDE', category: null, downloadLink: 'https://www.jetbrains.com/pycharm' },
  { title: 'Eclipse', description: 'IDE for Java developers', category: null, downloadLink: 'https://www.eclipse.org' },
  { title: 'Sublime Text', description: 'Lightweight code editor', category: null, downloadLink: 'https://www.sublimetext.com' },
  { title: 'Notepad++', description: 'Text editor for coding', category: null, downloadLink: 'https://notepad-plus-plus.org' },
  { title: 'Atom', description: 'Hackable text editor', category: null, downloadLink: 'https://atom.io' },
  { title: 'Git', description: 'Version control system', category: null, downloadLink: 'https://git-scm.com' },
  { title: 'Docker', description: 'Containerization platform', category: null, downloadLink: 'https://www.docker.com' },
  { title: 'Postman', description: 'API testing tool', category: null, downloadLink: 'https://www.postman.com' },
  { title: 'Android Studio', description: 'Android development IDE', category: null, downloadLink: 'https://developer.android.com/studio' },
  { title: 'Xcode', description: 'IDE for macOS/iOS', category: null, downloadLink: 'https://developer.apple.com/xcode' },
  { title: 'NetBeans', description: 'IDE for multiple languages', category: null, downloadLink: 'https://netbeans.apache.org' },

  // Education (11 phần mềm)
  { title: 'Anki', description: 'Flashcard learning tool', category: null, downloadLink: 'https://apps.ankiweb.net' },
  { title: 'Duolingo', description: 'Language learning app', category: null, downloadLink: 'https://www.duolingo.com' },
  { title: 'Khan Academy', description: 'Online learning platform', category: null, downloadLink: 'https://www.khanacademy.org' },
  { title: 'Coursera', description: 'Online courses', category: null, downloadLink: 'https://www.coursera.org' },
  { title: 'edX', description: 'Online education platform', category: null, downloadLink: 'https://www.edx.org' },
  { title: 'Quizlet', description: 'Study tool with flashcards', category: null, downloadLink: 'https://quizlet.com' },
  { title: 'Moodle', description: 'Learning management system', category: null, downloadLink: 'https://moodle.org' },
  { title: 'Google Classroom', description: 'Classroom management', category: null, downloadLink: 'https://classroom.google.com' },
  { title: 'Wolfram Alpha', description: 'Computational knowledge engine', category: null, downloadLink: 'https://www.wolframalpha.com' },
  { title: 'GeoGebra', description: 'Math learning tool', category: null, downloadLink: 'https://www.geogebra.org' },
  { title: 'Zotero', description: 'Research management tool', category: null, downloadLink: 'https://www.zotero.org' },

  // Security (10 phần mềm)
  { title: 'Bitdefender', description: 'Antivirus software', category: null, downloadLink: 'https://www.bitdefender.com' },
  { title: 'Malwarebytes', description: 'Malware removal tool', category: null, downloadLink: 'https://www.malwarebytes.com' },
  { title: 'Kaspersky', description: 'Antivirus and security', category: null, downloadLink: 'https://www.kaspersky.com' },
  { title: 'Norton', description: 'Comprehensive security suite', category: null, downloadLink: 'https://www.norton.com' },
  { title: 'Avast', description: 'Free antivirus software', category: null, downloadLink: 'https://www.avast.com' },
  { title: 'McAfee', description: 'Security software', category: null, downloadLink: 'https://www.mcafee.com' },
  { title: 'Trend Micro', description: 'Cybersecurity solutions', category: null, downloadLink: 'https://www.trendmicro.com' },
  { title: 'Avira', description: 'Free antivirus', category: null, downloadLink: 'https://www.avira.com' },
  { title: 'LastPass', description: 'Password manager', category: null, downloadLink: 'https://www.lastpass.com' },
  { title: '1Password', description: 'Secure password manager', category: null, downloadLink: 'https://1password.com' },

  // Communication (10 phần mềm)
  { title: 'Discord', description: 'Chat for communities', category: null, downloadLink: 'https://discord.com' },
  { title: 'Skype', description: 'Video and voice calls', category: null, downloadLink: 'https://www.skype.com' },
  { title: 'Microsoft Teams', description: 'Team collaboration', category: null, downloadLink: 'https://www.microsoft.com/teams' },
  { title: 'WhatsApp', description: 'Messaging app', category: null, downloadLink: 'https://www.whatsapp.com' },
  { title: 'Telegram', description: 'Secure messaging', category: null, downloadLink: 'https://telegram.org' },
  { title: 'Signal', description: 'Private messaging', category: null, downloadLink: 'https://signal.org' },
  { title: 'Viber', description: 'Messaging and calls', category: null, downloadLink: 'https://www.viber.com' },
  { title: 'Slack', description: 'Team communication', category: null, downloadLink: 'https://slack.com' },
  { title: 'Zoom', description: 'Video conferencing', category: null, downloadLink: 'https://zoom.us' },
  { title: 'Google Meet', description: 'Video meetings', category: null, downloadLink: 'https://meet.google.com' },

  // Media Players (10 phần mềm)
  { title: 'VLC Media Player', description: 'Versatile media player', category: null, downloadLink: 'https://www.videolan.org/vlc' },
  { title: 'Windows Media Player', description: 'Default Windows player', category: null, downloadLink: 'https://www.microsoft.com' },
  { title: 'iTunes', description: 'Media management and playback', category: null, downloadLink: 'https://www.apple.com/itunes' },
  { title: 'Winamp', description: 'Classic audio player', category: null, downloadLink: 'https://www.winamp.com' },
  { title: 'MediaMonkey', description: 'Music organizer', category: null, downloadLink: 'https://www.mediamonkey.com' },
  { title: 'Foobar2000', description: 'Customizable audio player', category: null, downloadLink: 'https://www.foobar2000.org' },
  { title: 'KMPlayer', description: 'Multimedia player', category: null, downloadLink: 'https://www.kmplayer.com' },
  { title: 'PotPlayer', description: 'Feature-rich media player', category: null, downloadLink: 'https://potplayer.daum.net' },
  { title: 'QuickTime', description: 'Apple media player', category: null, downloadLink: 'https://support.apple.com/quicktime' },
  { title: 'GOM Player', description: 'Video and audio player', category: null, downloadLink: 'https://www.gomlab.com' },

  // Utilities (12 phần mềm)
  { title: 'CCleaner', description: 'System cleaner', category: null, downloadLink: 'https://www.ccleaner.com' },
  { title: 'WinRAR', description: 'File compression tool', category: null, downloadLink: 'https://www.win-rar.com' },
  { title: '7-Zip', description: 'Free file archiver', category: null, downloadLink: 'https://www.7-zip.org' },
  { title: 'Rufus', description: 'USB bootable drive creator', category: null, downloadLink: 'https://rufus.ie' },
  { title: 'TeamViewer', description: 'Remote desktop software', category: null, downloadLink: 'https://www.teamviewer.com' },
  { title: 'Recuva', description: 'File recovery tool', category: null, downloadLink: 'https://www.ccleaner.com/recuva' },
  { title: 'Speccy', description: 'System information tool', category: null, downloadLink: 'https://www.ccleaner.com/speccy' },
  { title: 'CrystalDiskInfo', description: 'Disk health monitor', category: null, downloadLink: 'https://crystalmark.info' },
  { title: 'HWMonitor', description: 'Hardware monitoring', category: null, downloadLink: 'https://www.cpuid.com/softwares/hwmonitor.html' },
  { title: 'CPU-Z', description: 'System profiling tool', category: null, downloadLink: 'https://www.cpuid.com/softwares/cpu-z.html' },
  { title: 'Greenshot', description: 'Screenshot tool', category: null, downloadLink: 'https://getgreenshot.org' },
  { title: 'Everything', description: 'Fast file search', category: null, downloadLink: 'https://www.voidtools.com' },
];

// Hàm khởi tạo dữ liệu
async function seedDB() {
  try {
    // Xóa dữ liệu cũ
    await User.deleteMany({});
    await Category.deleteMany({});
    await Software.deleteMany({});
    console.log('Old data cleared');

    // Thêm users
    for (let user of users) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await new User(user).save();
    }
    console.log('Users seeded');

    // Thêm categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Categories seeded');

    // Gán category cho softwares
    let softwareIndex = 0;
    for (let i = 0; i < createdCategories.length; i++) {
      const category = createdCategories[i];
      const softwareCount = i === 0 ? 15 : i === 1 ? 12 : i === 2 ? 10 : i === 3 ? 14 : i === 4 ? 13 : i === 5 ? 11 : i === 6 ? 10 : i === 7 ? 10 : i === 8 ? 10 : 12; // Số lượng phần mềm mỗi category
      for (let j = 0; j < softwareCount; j++) {
        softwares[softwareIndex].category = category._id;
        softwareIndex++;
      }
    }

    // Thêm softwares
    await Software.insertMany(softwares);
    console.log('Softwares seeded');

    console.log('Database seeding completed!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

// Chạy hàm seed
seedDB();