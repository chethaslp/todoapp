import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged, signInWithRedirect, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";
import "https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.min.js";
import showtimeago from "./showtimeago.js";

// CHANGE THIS VARIABLE
const firebaseConfig = {
    apiKey: "AIzaSyAjhjIfgmhLryKLnLumsSkeJ_wpHK9QSQE",
    authDomain: "devprojectsclp.firebaseapp.com",
    databaseURL: "https://devprojectsclp-default-rtdb.firebaseio.com",
    projectId: "devprojectsclp",
    storageBucket: "devprojectsclp.appspot.com",
    messagingSenderId: "116707340006",
    appId: "1:116707340006:web:b6c2fa0e7389e8a879d527"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const loader = new bootstrap.Modal($("#modal-load"));
const md_ss = new bootstrap.Modal($("#modal-ss"));
let user, idToken;


var mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    if (check){
        $(".modal-body").text("Please use this site in desktop mode to continue.");
        loader.show();
        throw Error("Please use this site in desktop mode to continue.");
    }
};

mobileCheck();
onAuthStateChanged(auth, (u)=>{
    if(u){
        $(".dropdown").fadeOut({
            complete:()=>{
                $("#user-img").attr("src",u.photoURL);
                $("#user-id").text(u.email);
                $("#user-img-ph").hide();
                $("#user-img").show();
                $("#user-signin").hide();
                $("#user-signout").show();  
                loader.hide();
                $(".hist-bar-cnt").fadeIn();
                // $(".usr-hist-bar").fadeIn();
                u.getIdToken(true).then(function(idToken) {
                    $("#authToken").attr("value",idToken);
                    localStorage.setItem("token", idToken)
                    getUserTodos();
                }).catch(function(error) {
                    console.log(error)
                  });
                document.addEventListener("refreshTodos", getUserTodos)
                user = u;
                $(".dropdown").fadeIn();
            }
        })
    }else{
        $(".dropdown").fadeOut({
            complete:()=>{
                $("#user-img-ph").show();
                $("#user-img").hide();
                $("#user-id").text("Signin");
                $("#user-signin").show();
                $(".hist-bar-cnt").fadeOut();
                $("#user-signout").hide();  
                user = null;
                $(".dropdown").fadeIn();
            }
        });
    }
});

$("#user-signin").click(function (e) { 
    loader.show();
    signInWithRedirect(auth, new GoogleAuthProvider())
    .catch((error) => {
        console.log(error)
        loader.hide();
    });
});

$("#user-signout").click(function (e) { 
    signOut(auth);
});

document.onanimationend = (e) => {
    $(e.target).removeClass("shake");
  };

$('#modal-ss').on('hide.bs.modal', function (e) {
    $(".hist-bar-cnt").fadeIn();
    $("#inp-url").val("");
});

export function getUserTodos() {
    var idToken=localStorage.getItem("token")
    fetch("api/todo", {
        headers: { 'X-Token': idToken}
    })
    .then(async (resp)=>{
        let data = await resp.json()
        window.todos = data
        if(data.length != 0){
            $("#usr-hist").html("");
            data.forEach(p => {
                $("#usr-hist").append(`
                <li class="list-group-item" id="todo${p.tid}">
                    <div class="d-flex justify-content-between">
                        <span class="">${p.title}</span>
                        <div>
                            <span class="badge ${((p.status=='completed')? 'bg-success">Completed': (p.status=='pending')? 'bg-secondary">Pending': 'bg-danger">Dropped')}</span> &nbsp;
                            <span class="badge bg-info">${p.end_date}</span> &nbsp;
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button type="button" class="btn btn-primary" onClick="editTodo(${p.tid})"><i class="fa fa-edit" width="30px" alt="Edit Todo"></i></button>
                                <button type="button" class="btn btn-danger" onClick="dltTodo(${p.tid})"><i class="fa fa-trash" width="20px" alt="Delete Todo"></i></button>
                            </div>
                        </div>
                    </div>
                    <small class="text-muted"> ${p.details}<small/>
                </li>
                `)
            });
        }else{
            $("#usr-hist").html("<span> No Todos So Far.</span>");
        }
        $(".load-bar").fadeOut({
            complete:()=>{
                $(".usr-hist-bar").css("display","flex")
                $(".usr-hist-bar").fadeIn();
            }
        });
    });
};
