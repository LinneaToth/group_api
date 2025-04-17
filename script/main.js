async function userData(){
    const userContainer = document.querySelector('.card-container');

    try{
        const dataResponse = await fetch ('https://jsonplaceholder.typicode.com/users');

        if(!dataResponse.ok){
            throw new Error('Couldnt fetch userdata' + dataResponse.status)
        }
        const userData = await dataResponse.json();

        console.log(userData);

        for (const user of userData){  /* Lägger till bild, grundinformationen, knapp och en tom div i html-strängen för varje användare. (Bilden är just nu en placeholder, vi får lösa den biten sen) */
            userContainer.innerHTML +=`
            <div class="card">
                <img src="#" alt="User Image">
                <h2>${user.name}</h2>
                <p>Username: ${user.username}</p>
                <p>E-mail: ${user.email}</p>
                <button class="show-btn" data-userid="${user.id}">Show more info</button>
                <div class="more-info"></div>
            </div>                 
            `;     
        }

        const allButtons = document.querySelectorAll('.show-btn');

        /* Här hämtas resterande data vid klick på knapp */
        allButtons.forEach(button => {
            button.addEventListener('click', async() =>{
                const userCard = button.closest('.card'); /* Hittar närmsta parent med klassen card*/
                const moreInfo = userCard.querySelector('.more-info'); /* Hämtar diven med klassen more-info som ligger inuti card-klassen */
                const userId = button.dataset.userid;  /* Hämtar användarens ID från knappen via (data-userid) */

                try{
                    const [postsRes, todosRes] = await Promise.all([
                        fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`),
                        fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`)
                    ]);

                    if(!postsRes.ok){
                        throw new Error('Could not fetch posts.');
                    }

                    if(!todosRes.ok){
                        throw new Error('Could not fetch todos.');
                    }

                    const posts = await postsRes.json();
                    const todos = await todosRes.json();

                    console.log(posts);
                    console.log(todos);
                    
                    /* - Här nedan tänker tänker jag att posts ska loopas igenom, hämta comments med postId och använda t.ex slice(0,3) för att endast ha med 3 st kommentarer.


                    - Därefter lägga till posts, body från comments och todos i html-sträng och sedan in i den tomma diven ("more-info")


                    - Ska catch skrivas ut som en alert eller som ett meddelande direkt i DOM med innerhtml?

                    */

                }
                catch(e){
                    alert('Error! ' + e.message);
                }
            })
        })
    
    }
    catch(e){
        alert('Error! ' + e.message);
    }
}

userData();