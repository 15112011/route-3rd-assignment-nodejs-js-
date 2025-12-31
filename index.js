const fs = require('fs');
const http = require('http');
const zlib = require('zlib');
const { pipeline } = require('stream');

// Part 1: Core Modules (1.5 Grades)

/**
 * 1. Read a file in chunks using Readable Stream
 */
// const INPUT_FILE = './big.txt';
// const readStream = fs.createReadStream(INPUT_FILE, { encoding: 'utf-8' });

// readStream.on('data', (chunk) => {
//     console.log('Data Chunk:', chunk);
// });

// readStream.on('end', () => {
//     console.log('Finished reading file.');
// });


/**
 * 2. Copy content using Streams
 */
// const source = './source.txt';
// const destination = './dest.txt';

// const srcStream = fs.createReadStream(source);
// const destStream = fs.createWriteStream(destination);

// // Pipe solution
// srcStream.pipe(destStream);

// destStream.on('finish', () => {
//     console.log('Copy operation completed.');
// });

// srcStream.on('error', (err) => console.error('Reading Error:', err));
// destStream.on('error', (err) => console.error('Writing Error:', err));


/**
 * 3. Compression Pipeline
 */
// const rawInput = fs.createReadStream('./data.txt');
// const gzipOutput = fs.createWriteStream('./data.txt.gz');
// const gzip = zlib.createGzip();

// pipeline(rawInput, gzip, gzipOutput, (err) => {
//     if (err) {
//         console.error('Compression Error:', err);
//     } else {
//         console.log('File compressed successfully.');
//     }
// });


// Part 2: HTTP CRUD Operations (5.5 Grades)

// const DB_PATH = './users.json';

// const app = http.createServer((req, res) => {
//     const { method, url } = req;
    
//     const response = (code, data) => {
//         res.writeHead(code, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify(data));
//     };

//     // Route: /users
//     if (url === '/users') {
        
//         // GET: List users
//         if (method === 'GET') {
//             const users = JSON.parse(fs.readFileSync(DB_PATH));
//             response(200, { success: true, users });
//         }
        
//         // POST: Create user
//         else if (method === 'POST') {
//             let body = '';
//             req.on('data', chunk => body += chunk);
//             req.on('end', () => {
//                 const newUser = JSON.parse(body);
//                 const users = JSON.parse(fs.readFileSync(DB_PATH));
                
//                 if (users.some(u => u.email === newUser.email)) {
//                     return response(409, { success: false, message: 'Email already exists' });
//                 }

//                 newUser.id = users.length ? users[users.length - 1].id + 1 : 1;
//                 users.push(newUser);
//                 fs.writeFileSync(DB_PATH, JSON.stringify(users));
//                 response(201, { success: true, message: 'User created' });
//             });
//         }
//     } 
    
//     // Route: /users/:id
//     else if (url.startsWith('/users/')) {
//         const id = url.split('/')[2];
        
//         // GET: Single User
//         if (method === 'GET') {
//             const users = JSON.parse(fs.readFileSync(DB_PATH));
//             const user = users.find(u => u.id == id);
            
//             user 
//                 ? response(200, { success: true, user })
//                 : response(404, { success: false, message: 'User not found' });
//         }

//         // PUT: Update User
//         else if (method === 'PUT') {
//             let body = '';
//             req.on('data', chunk => body += chunk);
//             req.on('end', () => {
//                 const updates = JSON.parse(body);
//                 const users = JSON.parse(fs.readFileSync(DB_PATH));
//                 const idx = users.findIndex(u => u.id == id);
                
//                 if (idx !== -1) {
//                     users[idx] = { ...users[idx], ...updates };
//                     fs.writeFileSync(DB_PATH, JSON.stringify(users));
//                     response(200, { success: true, message: 'User updated' });
//                 } else {
//                     response(404, { success: false, message: 'User not found' });
//                 }
//             });
//         }

//         // DELETE: Remove User
//         else if (method === 'DELETE') {
//             const users = JSON.parse(fs.readFileSync(DB_PATH));
//             const idx = users.findIndex(u => u.id == id);
            
//             if (idx !== -1) {
//                 users.splice(idx, 1);
//                 fs.writeFileSync(DB_PATH, JSON.stringify(users));
//                 response(200, { success: true, message: 'User deleted' });
//             } else {
//                 response(404, { success: false, message: 'User not found' });
//             }
//         }
//     } 
    
//     // 404
//     else {
//         response(404, { success: false, message: 'Endpoint not found' });
//     }
// });

// // app.listen(3000, () => console.log('Server running on port 3000'));


// Part 3: Node Internals Theory (3 Grades)

/**
 * 1. what is the Node.js Event Loop?
 */
// هو النظام المسؤول عن إدارة الـ Asynchronous operations في Node.js. بما إن Node.js single-threaded، الـ Event Loop بياخد الـ callbacks من الـ Queue وينفذها في الـ Call Stack لما يفضى، وده اللي بيخلي Node.js سريع في الـ I/O.


/**
 * 2. What is Libuv and What Role Does It Play?
 */
// دي مكتبة مبنية بـ C++، وهي المحرك الأساسي لـ Node.js المسؤولة عن التعامل مع نظام التشغيل (OS) وتنفيذ العمليات اللي محتاجة وقت (I/O) عبر الـ Thread Pool، زي التعامل مع الملفات والشبكات.


/**
 * 3. How Does Node.js Handle Asynchronous Operations?
 */
// لما بتطلب عملية async، الـ Call Stack بيبعتها للـ Node API (زي Libuv). Libuv بتنفذها في الخلفية (Background) ولما تخلص، بتبعت الـ callback بتاعها للـ Callback Queue، وبعدين الـ Event Loop ينقلها للـ Call Stack عشان تتنفذ.


/**
 * 4. Difference Between Call Stack, Event Queue, and Event Loop?
 */
// - Call Stack: المكان اللي بيتم فيه تنفيذ الكود لحظياً (LIFO).
// - Event Queue: طابور الانتظار اللي بتتجمع فيه الـ callbacks اللي خلصت ومستنية دورها (FIFO).
// - Event Loop: المراقب اللي بيفضل يبص، لو الـ Stack فاضي، يسحب من الـ Queue ويحط في الـ Stack.


/**
 * 5. What is the Node.js Thread Pool?
 */
// مجموعة من الـ worker threads (الافتراضي 4) بتوفرها Libuv عشان تنفذ العمليات التقيلة اللي ممكن توقف الـ Event Loop (Blocking)، زي ضغط الملفات أو التشفير أو بعض عمليات الـ Filesystem.


/**
 * 6. Blocking vs Non-Blocking Code Execution?
 */
// - Blocking: الكود بيقف ومبيكملش للي بعده غير لما العملية الحالية تخلص (زي readFileSync).
// - Non-blocking: الكود بيبدأ العملية ويكمل تنفيذ باقي السطور علطول، ولما العملية تخلص بيتم استدعاء callback بالنتيجة.
