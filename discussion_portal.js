var submitQuestionNode=document.getElementById("submitBtn");
var questionTitleNode=document.getElementById("subject");
var questionDescriptionNode=document.getElementById("question");
var allQuestionListNode=document.getElementById("dataList");
var createQuestionFormNode=document.getElementById("toggleDisplay");
var questionDetailContainerNode=document.getElementById("respondQue");
var resolveQuestionContainerNode=document.getElementById("resolveHolder");
var resolveQuestionNode=document.getElementById("resolveQuestion");
var responseContainerNode=document.getElementById("respondAns");
var commentContainerNode=document.getElementById("commentHolder");
var commentatorNameNode=document.getElementById("pickName");
var commentNameNode=document.getElementById("pickComment");
var submitCommentNode=document.getElementById("commentBtn");

var newQuestionForm=document.getElementById("newQuestionForm");
newQuestionForm.addEventListener("click",newForm);

function newForm()
{
    createQuestionFormNode.style.display="block";
    questionDetailContainerNode.style.display="none";
     resolveQuestionContainerNode.style.display="none";
     responseContainerNode.style.display="none";
    commentContainerNode.style.display="none";
}



var upvote=document.getElementById("upvote");
var downvote=document.getElementById("downvote");


var questionSearchNode=document.getElementById("questionSearch");
questionSearchNode.addEventListener("keyup",function(event)
{
      //show filtered result
      filterResult(event.target.value);

})


function filterResult(query)
{
    var allQuestions=getAllQuestion()
  
    
    if(query)
    {
      clearQuestionPanel();
  
      var filteredQuestions=allQuestions.filter(function(question)
      {
        if(question.title.includes(query))
        {
          return true;
        }
      });

      if(filteredQuestions.length)
      {
        filteredQuestions.forEach(function(question)
        {
          addQuestionToPanel(question);
        })
      }
      else
      {
        printNoMatchFound();
      }
    }
    else
    {
      clearQuestionPanel();
      allQuestions.forEach(function(question)
      {
            addQuestionToPanel(question);
      });

    }

  
}

function clearQuestionPanel()
{
  allQuestionListNode.innerHTML="";
}

//Display all existing Question
function onLoad()
{
   var allQuestions=getAllQuestion();


    allQuestions=allQuestions.sort(function(currentQ,nextQ)
    {
        if(currentQ.isFav)
        {
           return -1;
        }
        return 1;
    })

   allQuestions.forEach(function(question)
   {
         addQuestionToPanel(question);
   })
}
onLoad();

//listen for the submit button to create question

submitQuestionNode.addEventListener("click",onQuestionSubmit);

function onQuestionSubmit()
{
  var question={
    title:questionTitleNode.value,
    description:questionDescriptionNode.value,
    responses:[],
    upvotes:0,
    downvotes:0,
    createdAt: Date.now(),
    isFav:false


  }
    saveStorage(question);
    addQuestionToPanel(question);
}

//save question in storage


function saveStorage(question)
{  
    var allQuestion=getAllQuestion()

     allQuestion.push(question);

    localStorage.setItem("questions",JSON.stringify(allQuestion));
}


//get all question from storage
function getAllQuestion()
{
  var allQuestions=localStorage.getItem("questions");

  if(allQuestions)
  {
    allQuestions=JSON.parse(allQuestions);
  }

  else
  {
    allQuestions=[];
  }
  return allQuestions;
}
//append question to the left pane


function addQuestionToPanel(question)
{
    var questionContainer=document.createElement("div");
    questionContainer.setAttribute("id",question.title);
    questionContainer.style.background="blue";

    var newQuestionTitleNode=document.createElement("h4");
    var newQuestionDescriptionNode=document.createElement("p");

    newQuestionTitleNode.innerHTML=question.title;
    newQuestionDescriptionNode.innerHTML=question.description;
    
    questionContainer.appendChild(newQuestionTitleNode);
    questionContainer.appendChild(newQuestionDescriptionNode);
    
    allQuestionListNode.appendChild(questionContainer);

    var upvoteTextNode=document.createElement("h4");
    upvoteTextNode.innerHTML="upvote = "+ question.upvotes
    questionContainer.appendChild(upvoteTextNode);

    var downvoteTextNode=document.createElement("h4");
    downvoteTextNode.innerHTML="downvote = "+ question.downvotes
    questionContainer.appendChild(downvoteTextNode);

    var createDateAndTimeNode=document.createElement("h3");
    createDateAndTimeNode.innerHTML=new Date(question.createdAt).toLocaleString();
    questionContainer.appendChild(createDateAndTimeNode);

    var createAtNode=document.createElement("h3");
    createAtNode.innerHTML="created"+convertDateToCreatedAtTime(question.createdAt)+ " ago";
    questionContainer.appendChild(createAtNode);

    setInterval(function()
    {
        createAtNode.innerHTML="created"+convertDateToCreatedAtTime(question.createdAt)+ " ago";
    },1000);

    var addToFavNode=document.createElement("button");

     
    if(question.isFav)
    {
       addToFavNode.innerHTML="remove fav";
    }
    else
    {
       addToFavNode.innerHTML="add fav"
    }
     
    questionContainer.appendChild(addToFavNode);

    addToFavNode.addEventListener("click", toggleFavQuestion(question));





    
    
     clearQuestionForm();
     questionContainer.addEventListener("click",onQuestionClick(question))
    
    
}

function toggleFavQuestion(question)
{
  return function(event)
  {
    event.stopPropagation();
    question.isFav = !question.isFav;
    updateQuestion(question)
    
        if(question.isFav)
        {
           event.target.innerHTML="remove fav";
        }
        else
        {
           event.target.innerHTML="add fav"
        }

   

  }
}


function convertDateToCreatedAtTime(date)
{
  
   var currentTime=Date.now();
   var timeLapsed=currentTime-new Date(date).getTime();

   var secondDiff=parseInt(timeLapsed/1000);
   var minutesDiff=parseInt(secondDiff/60);
   var hoursDiff=parseInt(minutesDiff/60);
   if(hoursDiff==0)
   {
         if(minutesDiff==0)
        {
             return "few seconds";
        }
        else
        {
             return minutesDiff + " minutes ";
        }
   }
   else
   {
        if(hoursDiff>24)
        {
            return parseInt(hoursDiff/24) + " day " ;
        }
        else
        {
            return hoursDiff + " hours ";
        }
   }

   
   
}

//clear Question Form
function clearQuestionForm()
{
     questionTitleNode.value="";
     questionDescriptionNode.value="";
}
//listen for click the question in left pane

function onQuestionClick(question)
{
  return function()
  {
    //hide Question panel
    hideQuestionPanel();

       //clear last details
     clearQuestionDetails();
     clearResponsePanel();
    //show clicked Question
    showQuestionDetails();
    
    
    //add question to right
    addQuestionToRight(question);

    //show all previous response
    question.responses.forEach(function(response)
    {
      addResponsesOnPanel(response);
    })

    //listen for response Submit
    submitCommentNode.onclick=onSubmitResponce(question);

    upvote.onclick=upvoteQuestion(question);
    downvote.onclick=downvoteQuestion(question);
    resolveQuestionNode.onclick=removeQuestion(question);

  }

}

//upvote question
function upvoteQuestion(question)
{
  return function()
  {
     question.upvotes++;
     updateQuestion(question)
     updateQuestionUI(question);
  }
}

// downvote question 
function downvoteQuestion(question)
{
  return function()
  {
    question.downvotes++;
    updateQuestion(question);
    updateQuestionUI(question);
  }
}

function removeQuestion(question)
{
  return function()
  {
    deleteQuestion(question)
    
    deleteQuestiononUI(question);
    hideCommentDetails();
    showQuestionForm();   
  }
}

// update question
function updateQuestion(updatedQuestion)
{
  
    allQuestion = getAllQuestion();
   
    var revisedQuestion=allQuestion.map(function(question)
    {
      if(updatedQuestion.title===question.title)
      {
         return updatedQuestion;
      }
      return question;
    })
    localStorage.setItem("questions",JSON.stringify(revisedQuestion));


}



function updateQuestionUI(question)
{
      var questionContainerNode=document.getElementById(question.title);
      //console.log(question.title);
      questionContainerNode.childNodes[2].innerHTML="upvote ="+question.upvotes;
      questionContainerNode.childNodes[3].innerHTML="downvote ="+question.downvotes;
}

function deleteQuestiononUI(question)
{
  var questionContainerNode=document.getElementById(question.title);
 // console.log(questionContainerNode);
  var parent=questionContainerNode.parentNode;
 // console.log(parent);
  parent.removeChild(questionContainerNode);

}


function deleteQuestion(deletequestion)
{
    allQuestion = getAllQuestion();
      
    allQuestion.forEach(function(question)
    {
        if(deletequestion.title===question.title)
        {
            var index = allQuestion.indexOf(question)
            allQuestion.splice(index,1);
        }
   })
   localStorage.setItem("questions",JSON.stringify(allQuestion));
}


function hideCommentDetails()
{
  questionDetailContainerNode.style.display="none";
    resolveQuestionContainerNode.style.display="none";
    responseContainerNode.style.display="none";
    commentContainerNode.style.display="none";
   
}

//show Question form
function showQuestionForm()
{
   createQuestionFormNode.style.display="block";
}

//append in the right pane
//listen for click on submit responce button

function onSubmitResponce(question)
{
    return function()
    {

       var response={
         name: commentatorNameNode.value,
         description:commentNameNode.value
       }
        saveResponse(question,response);
        addResponsesOnPanel(response);
        clearResponseForm();

    }
}
//display responce in response section

function addResponsesOnPanel(response)
{
    var userNameNode=document.createElement("h2");
    
    userNameNode.innerHTML=response.name;

    var userCommentNode=document.createElement("p");
    userCommentNode.innerHTML=response.description;

    var container=document.createElement("div");
    container.style.background="green";
    container.appendChild(userNameNode);
    container.appendChild(userCommentNode);
    responseContainerNode.appendChild(container);


}

//hide Question Panel
function hideQuestionPanel()
{
    createQuestionFormNode.style.display="none";
}

//dispaly Question Details
function showQuestionDetails()
{
     questionDetailContainerNode.style.display="block";
     resolveQuestionContainerNode.style.display="block";
     responseContainerNode.style.display="block";
    commentContainerNode.style.display="block";
}

function addQuestionToRight(question)
{
   var titleNode=document.createElement("h3");
   titleNode.innerHTML=question.title;

    var descriptionNode=document.createElement("h3");
   descriptionNode.innerHTML=question.description;

   questionDetailContainerNode.appendChild(titleNode);
   questionDetailContainerNode.appendChild(descriptionNode);
}


function saveResponse(updatedQuestion,response)
{
    var allQuestion=getAllQuestion();

    var revisedQuestion=allQuestion.map(function(questions)
     {
    if(updatedQuestion.title===questions.title)
    {
      questions.responses.push(response)
    }
    return questions;
     })
     localStorage.setItem("questions",JSON.stringify(revisedQuestion));
}

function clearQuestionDetails()
{
  questionDetailContainerNode.innerHTML="";
  
}
function clearResponsePanel()
{
  responseContainerNode.innerHTML="";
}

function clearResponseForm()
{
  commentatorNameNode.value="";
  commentNameNode.value="";

}

function printNoMatchFound()
{
  var title=document.createElement("h1");
  title.innerHTML="No Match Found";

  allQuestionListNode.appendChild(title)
}