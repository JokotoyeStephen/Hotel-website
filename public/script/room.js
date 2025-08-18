
 const menuIcon = document.getElementById('our');
const navlinks = document.getElementById('menuicon');

menuIcon.addEventListener('click', () => {
    navlinks.classList.toggle('active');
});
 
 const executive = document.getElementById("executive");
    executive.addEventListener('click', ()=>{
    // alert("i see me")    
    localStorage.setItem('rooms', JSON.stringify("Executive Suite"))
    window.location.href="./booking.html"

    })

 const deluxe = document.getElementById("deluxe");
    deluxe.addEventListener('click', ()=>{
    localStorage.setItem('rooms', JSON.stringify("Deluxe Room"))
    window.location.href="./booking.html"
    })

 const standard = document.getElementById("standard");
    standard.addEventListener('click', ()=>{
    localStorage.setItem('rooms', JSON.stringify("Standard Room"))
    window.location.href="./booking.html"
    })

 const accessible = document.getElementById("accessible");
    accessible.addEventListener('click', ()=>{    
    localStorage.setItem('rooms', JSON.stringify("Accessible Room"))
    window.location.href="./booking.html"
    })
 const premier = document.getElementById("premier");
    premier.addEventListener('click', ()=>{ 
    localStorage.setItem('rooms', JSON.stringify("premier Suite"))
    window.location.href="./booking.html"
    })

 const president = document.getElementById("president");
    president.addEventListener('click', ()=>{
    localStorage.setItem('rooms', JSON.stringify("presidential Suite"))
    window.location.href="./booking.html"
    })
 const twins = document.getElementById("twins");
    twins.addEventListener('click', ()=>{
    localStorage.setItem('rooms', JSON.stringify("Twin Room"))
    window.location.href="./booking.html"
    })

 const villa = document.getElementById("villa");
    villa.addEventListener('click', ()=>{
    localStorage.setItem('rooms', JSON.stringify("Villa/chalet")) 
    window.location.href="./booking.html"
    })
    
 const cabana = document.getElementById("Cabana");
    cabana.addEventListener('click', ()=>{
    localStorage.setItem('rooms', JSON.stringify("Cabana Room")) 
    window.location.href="./booking.html"

    })


