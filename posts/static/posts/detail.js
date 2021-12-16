const backBtn = document.getElementById("back-btn");
const UpdateBtn = document.getElementById("update-btn");
const DeleteBtn = document.getElementById("delete-btn");
const url = window.location.href + "data/";
const spinnerBox = document.getElementById("spinner-box");

backBtn.addEventListener('click', ()=>{
    history.back();
})

$.ajax({
    type:'GET',
    url:url,
    success: function (response) {
        console.log(response);

        const data = response.data;
        if(data.logged_in !==data.author){
            console.log("different");
        }else{
            console.log("same");
            UpdateBtn.classList.remove('not-visible');
            DeleteBtn.classList.remove('not-visible');
        }

        spinnerBox.classList.add('not-visible');
    },
    error: function (error) {
        console.log(error);
    }
})