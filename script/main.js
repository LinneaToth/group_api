


function clearInfoBox() { //clearing the container with extra info 
    const cardInformation = document.querySelector(".card-information");
    cardInformation.innerHTML = "";
}

function addTodos(todoArray) { //Adds users todo to the container with extra info 
    const todoContainer = document.createElement("section");
    const cardInformation = document.querySelector(".card-information");
    const todoHeading = document.createElement("h2");
    todoHeading.innerText = "To-do's"; //HÄR SKULLE VI KUNNA UTVECKLA FUNKTIONEN SÅ DEN SKRIVER TEX MRS DENNIS' TODOS
    todoContainer.append(todoHeading);

    todoArray.forEach((todo) => { //Looping through all of the todo-s, creating DOM-elements for them
        const todoTitle = document.createElement("h3");
        const todoCompleted = document.createElement("i");
        todoTitle.innerText = todo.title;
        todoCompleted.classList.add("fa-solid");
        todoCompleted.classList.add(todo.completed ? "fa-check" : "fa-xmark"); //✔️ if completed, ✖️ if not
        todoContainer.append(todoTitle, todoCompleted);
    })
    cardInformation.append(todoContainer);
}
 
async function addPosts(postArray, amtComments) {
    const postContainer = document.createElement("section");
    const cardInformation = document.querySelector(".card-information");
    const postHeading = document.createElement("h2");
    postHeading.innerText = "Posts"; //HÄR SKULLE VI KUNNA UTVECKLA FUNKTIONEN SÅ DEN SKRIVER TEX MRS DENNIS' POSTS
    postContainer.append(postHeading);

    postArray.forEach(async (post) => {
        const postCard = document.createElement("article");
        const postHeading = document.createElement("h3");
        postHeading.innerText = post.title;
        const postContent = document.createElement("p");
        postContent.innerText = post.body;
        postCard.append(postHeading, postContent);


        const commentCard = document.createElement("article");
        let comments = await getPostComments(post.id);
        comments = comments.slice(0, amtComments); //specifies the amount of comments shown
        console.log(comments);

        comments.forEach((comment) => {
            const commentBody = document.createElement("p");
            commentBody.innerText = comment.body;
            commentBody.classList.add("comment");
            commentCard.append(commentBody);
        })
        postCard.append(commentCard);        
        postContainer.append(postCard);
    })

    cardInformation.append(postContainer);
}

async function getPostComments(postID) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postID}/comments`);
    const comments = await response.json();
    return comments;
}

async function userData() {
    const userContainer = document.querySelector('.card-container');

    try{
        const dataResponse = await fetch ('https://jsonplaceholder.typicode.com/users');

        if(!dataResponse.ok){
            throw new Error('Couldnt fetch userdata' + dataResponse.status)
        }
        const userData = await dataResponse.json();

        console.log(userData);

        for (const user of userData){  /* Lägger till bild, grundinformationen, knapp och en tom div i html-strängen för varje användare.  */
            userContainer.innerHTML +=`
            <div class="card">
                <img src="./images/avatars/${user.id}.jpeg" alt="User Image" class="user-img">
                <h2>${user.name}</h2>
                <section>
                    <p>Username: ${user.username}</p>
                    <p>E-mail: ${user.email}</p>
                </section>
                <button class="show-btn" data-userid="${user.id}">Posts and to-do's</button>
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

                    console.log("posts: ", posts);
                    console.log("todos: ", todos);

                    clearInfoBox(); //clearing the info box from previous information
                    addTodos(todos); //calls function that adds all of this users posts to the assigned container
                    addPosts(posts, 3); //calls function that add posts, amount of comments shown as argument

                    
                    /* 
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