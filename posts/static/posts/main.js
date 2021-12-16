console.log("main.js in from post loaded!");

const postBox = document.getElementById('post-box');
const spinnerBox = document.getElementById('spinner-box');
const loadBtn = document.getElementById('load-btn');
const endBox = document.getElementById('end-box');


const postForm = document.getElementById("post-form");
const title = document.getElementById("id_title");
const body = document.getElementById("id_body");
const csrf = document.getElementsByName("csrfmiddlewaretoken");


const alertBox = document.getElementById('alert-box');

const url = window.location.href;

//django csrf for ajax from: https://docs.djangoproject.com/en/3.2/ref/csrf/
const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');
//end django csrf token code


//like unlike post function
const likeUnlikePosts = () => {
    const likeUnlikeForm = [...document.getElementsByClassName('like-unlike-forms')];
    likeUnlikeForm.forEach(form=>form.addEventListener('submit', e=>{
        e.preventDefault();
        const clickedId = e.target.getAttribute('data-form-id');
        const clickedBtn = document.getElementById(`like-unlike-${clickedId}`);
        const countInfo = document.getElementById(`count-${clickedId}`);

        //make ajax call
        $.ajax({
            type: 'POST',
            url: 'like-unlike',
            data:{
                'csrfmiddlewaretoken' : csrftoken,
                'pk' : clickedId
            },
            success: function (response) {
                console.log(response);
                //clickedBtn.textContent = response.liked ? `UnLike (${response.count})` : `Like (${response.count})`
                clickedBtn.classList = response.liked  ? 'fas fa-heart' : 'far fa-heart';
                countInfo.textContent = response.liked ? `UnLike (${response.count})` : `Like (${response.count})`;
            },
            error: function (e) {
                console.log(e);

            }
        })

    }))
}




//get data
let visible = 3;
const getData = () => {

    //fun start
    $.ajax({
        type: 'GET',
        url: `/data/${visible}/`,
        success: function (response) {
            console.log(response);
            //const data = JSON.parse(response.data);
            //console.log(data);
            const data = response.data;
            setTimeout(()=>{

                spinnerBox.classList.add('not-visible');
                console.log(data);
                data.forEach(el=>{
                    postBox.innerHTML += `
                    
                        <div class="col-lg-4">
                            <div class="card mb-2 shadow-sm" >
                               <img src="..." class="card-img-top" alt="...">
                               <div class="card-body">
                                 <h5 class="card-title">${el.title}</h5>
                                 <p class="card-text">${el.body}</p>
                               
                               </div>
                               <div class="card-footer">
                                    <div class="row">
                                        <div class="col-lg-6"><a href="${url}${el.id}" class="btn btn-primary red-btn"><i class="fa fa-eye"></i>&nbsp;View Post</a></div>
                                        <div class="col-lg-6">
                                            
                                            <form class="like-unlike-forms" data-form-id="${el.id}">
                                                <span style="float: right;">
                                                    <button class="${el.liked ? 'fas fa-heart' : 'far fa-heart'} " id="like-unlike-${el.id}" style="border: 0; background-color: transparent; font-size: 25px;">
                                                        <!--
                                                        <i style="font-size: 25px;" class="${el.liked ? 'fas fa-heart' : 'far fa-heart'} "></i>
                                                        -->
                                                    </button>
                                                    &nbsp;&nbsp;
                                                    <p id="count-${el.id}" style="float: right;">${el.liked ? `UnLike (${el.count})` : `Like (${el.count})`}</p>
                                                </span>
                                            </form>
                                            
                                            
                                            
                                                                                       
                                        
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                    
                   `
                });
            likeUnlikePosts();


            },1000);


            if(response.size === 0){
                endBox.textContent = "No posts yet.";
            }
            else if(response.size <=visible){
                loadBtn.classList.add('not-visible');
                endBox.textContent = "No more posts.";
            }


        },
        error: function (error) {
            console.log(error)
        }
    })
    //fun ends
}


loadBtn.addEventListener('click',()=>{
    spinnerBox.classList.remove('not-visible');
    visible += 3;
    getData();
});


postForm.addEventListener('submit', e=>{
    e.preventDefault()

    $.ajax({
       type:'POST',
       url:'',
       data:{
           'csrfmiddlewaretoken':csrf[0].value,
           'title':title.value,
           'body':body.value,
       },
       success: function (response) {
           console.log(response);
           postBox.insertAdjacentHTML('afterbegin',`
           
                        <div class="col-lg-4">
                            <div class="card mb-2 shadow-sm" >
                               <img src="..." class="card-img-top" alt="...">
                               <div class="card-body">
                                 <h5 class="card-title">${response.title}</h5>
                                 <p class="card-text">${response.body}</p>
                               
                               </div>
                               <div class="card-footer">
                                    <div class="row">
                                        <div class="col-lg-6"><a href="#" class="btn btn-primary red-btn"><i class="fa fa-eye"></i>&nbsp;View Post</a></div>
                                        <div class="col-lg-6">
                                            
                                            <form class="like-unlike-forms" data-form-id="${response.id}">
                                                <span style="float: right;">
                                                    <button class="fas fa-heart" id="like-unlike-${response.id}" style="border: 0; background-color: transparent; font-size: 25px;">
                                                        
                                                    </button>
                                                    &nbsp;&nbsp;
                                                    <p id="count-${response.id}" style="float: right;">Like(0)</p>
                                                </span>
                                            </form>
                                            
                                            
                                            
                                                                                       
                                        
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
           
           `);
           likeUnlikePosts();
           $('#exampleModal').modal('hide');
           handleAlerts('success', 'New post added');
           postForm.reset();
       },
       error: function (error) {
           console.log(error);
           handleAlerts('danger', 'Whoops... something went wrong');
       }
    });
});


getData();