
        fetch('/blog.json').then(response => response.json()).then(data=>{ 
            console.log(data)
            let view=document.getElementById("view-container")
            data.forEach(user => {
                let div=document.createElement('div');
                div.innerHTML=`<h1><a href="/post/${user.id}">${user.title}</a></h1>`
                view.appendChild(div)
            });
        }).catch(error=> console.log("Error:",error))