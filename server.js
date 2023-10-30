import http from 'http';
import app  from './app/app.js';



//create server
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);




server.listen(PORT,()=>{
    console.log(`server is running at the port : ${PORT}`); 
});

