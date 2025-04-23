


function clearInfoBox() { //clearing the container with extra info 
    const cardInformation = document.querySelector(".card-information");
    cardInformation.innerHTML = "";
}

function addTodos(todoArray, name) { //Adds users todo to the container with extra info 
    const todoContainer = document.createElement("section");
    const cardInformation = document.querySelector(".card-information");
    const todoHeading = document.createElement("h2");
    todoHeading.innerText = `${name.toUpperCase()}'S TO-DO'S`;
    todoContainer.append(todoHeading);

    todoArray.forEach((todo) => { //Looping through all of the todo-s, creating DOM-elements for them
        const todoItem = document.createElement("article");
        todoItem.classList.add("todo-item");
        const todoTitle = document.createElement("p");
        const todoCompleted = document.createElement("i");
        todoTitle.innerText = todo.title;
        todoCompleted.classList.add("fa-solid");
        todoCompleted.classList.add(todo.completed ? "fa-check" : "fa-xmark"); //✔️ if completed, ✖️ if not
        todoItem.append(todoCompleted, todoTitle);
        todoContainer.append(todoItem);
    })
    cardInformation.append(todoContainer);
}

async function addPosts(postArray, amtComments, name) {
    const postContainer = document.createElement("section");
    const cardInformation = document.querySelector(".card-information");
    const postHeading = document.createElement("h2");
    postHeading.innerText = `${name.toUpperCase()}'S POSTS`;
    postContainer.append(postHeading);

    postArray.forEach(async (post) => {
        const postCard = document.createElement("article");
        postCard.classList.add("post-card");
        const postHeading = document.createElement("h3");
        postHeading.innerText = post.title;
        const postContent = document.createElement("p");
        postContent.innerText = post.body;
        postCard.append(postHeading, postContent); //adds heading and the content of the post to the article

        const commentCard = document.createElement("article"); //contains all of the comments for each post
        commentCard.classList.add("hidden", "comment-card");
        let comments = await getPostComments(post.id);
        comments = comments.slice(0, amtComments); //specifies the amount of comments shown
        console.log(comments);

        const commentsBtn = document.createElement("button"); //Button toggling visibility of comments for each post
        commentsBtn.classList.add('btn-comments')
        commentsBtn.innerText = "Show comments";
        commentsBtn.addEventListener("click", () => {
            commentCard.classList.toggle("hidden");

            if (commentsBtn.innerText === "Show comments") { //Changes inner text on button, depending on what happens when it is clicked
                commentsBtn.innerText = "Hide comments";
            } else {
                commentsBtn.innerText = "Show comments"
            }
        })

        comments.forEach((comment) => { //adds each comment to the page
            const commentBody = document.createElement("p");
            commentBody.innerText = comment.body;
            commentBody.classList.add("comment");
            commentCard.append(commentBody);
        })

        postCard.append(commentsBtn, commentCard);        
        postContainer.append(postCard);
    })

    cardInformation.append(postContainer);
}

async function getPostComments(postID) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postID}/comments`);
    const comments = await response.json();
    return comments;
}


const closeBtn = document.querySelector("#closeBtn");

closeBtn.addEventListener("click", () =>{
    const infobox = document.querySelector(".card-information");
    infobox.classList.remove("show-info");
    closeBtn.classList.add("hidden");
})

// Main function to fetch and display user data
async function userData() {
    const userContainer = document.querySelector('.card-container');

    try{
        const dataResponse = await fetch ('https://jsonplaceholder.typicode.com/users');

        if(!dataResponse.ok){
            throw new Error('Could not fetch userdata: ' + dataResponse.status);
        }
        const userData = await dataResponse.json();

        console.log(userData);

        for (const user of userData){  // Loop through each user and add image, basic user info and two buttons (one for posts & one for todos)
            userContainer.innerHTML +=`
            <div class="card">
                <img src="./images/avatars/${user.id}.jpeg" alt="Image of ${user.name}" class="user-img">
                <h2>${user.name}</h2>
                <section>
                    <p>Username: ${user.username}</p>
                    <p>E-mail: ${user.email}</p>
                </section>
                <button class="btn-posts" data-userid="${user.id}">Show Posts</button>
                <button class="btn-todos" data-userid="${user.id}">Show To-Do's</button>
            </div>                 
            `;     
        }

        const postButtons = document.querySelectorAll('.btn-posts');
        const todoButtons = document.querySelectorAll('.btn-todos');
        const infobox = document.querySelector(".card-information");
        const closeBtn = document.querySelector("#closeBtn");

        // Add eventlistener to all "Show Posts" buttons & fetch posts API
        postButtons.forEach(button => {
            button.addEventListener('click', async() => {
                clearInfoBox();   // Clear infobox from previous data

                const userId = button.dataset.userid;  // Get user ID from button attribute. This needs to be inside each button function to get the correct user
                // Get user's name from the clicked card
                const userCard = button.closest('.card');
                const name = userCard.querySelector("h2").innerText;

                infobox.classList.add("show-info");
                closeBtn.classList.remove("hidden");


                try{
                    const postRes = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);

                    if(!postRes.ok){
                        throw new Error('Could not fetch posts: ' + postRes.status);
                    }
                    const posts = await postRes.json();

                    console.log('posts: ', posts);

                    addPosts(posts, 3, name); // Call posts function + 3 comments
                }
                catch (e){
                    alert('Error! ' + e.message);
                }
                
            });
        });

         // Add eventlistener to all "Show To-Do's" buttons & fetch todos API
        todoButtons.forEach(button => {
            button.addEventListener('click', async() => {
                clearInfoBox(); // Clear infobox from previous data

                const userId = button.dataset.userid; // Get user ID from button attribute. This needs to be inside each button function to get the correct user
                // Get user's name from the clicked card
                const userCard = button.closest('.card'); 
                const name = userCard.querySelector("h2").innerText;

                infobox.classList.add("show-info");
                closeBtn.classList.remove("hidden");

                try{
                    const todosRes = await fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`);

                    if(!todosRes.ok){
                        throw new Error('Could not fetch todos: ' + todosRes.status);
                    }
                    const todos = await todosRes.json();

                    console.log('todos: ', todos);

                    addTodos(todos, name);   // Call todos function 
                }
                catch (e){
                    alert('Error! ' + e.message);
                }
                
            });
        });
        
    }catch(e){
        alert('Error! ' + e.message);
    }
}

userData();


