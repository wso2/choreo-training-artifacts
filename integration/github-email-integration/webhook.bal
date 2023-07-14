import ballerinax/trigger.github;
import ballerina/http;
import wso2/choreo.sendemail as email;
import ballerina/log;

configurable github:ListenerConfig config = ?;

// Email recepient address
configurable string recipientAddress = ?;

listener http:Listener httpListener = new(8090);
listener github:Listener webhookListener =  new(config,httpListener);

service github:IssuesService on webhookListener {
  
    remote function onOpened(github:IssuesEvent payload ) returns error? {
      string issueTitle = payload.issue.title;
      string issueBody = payload.issue.body ?: "";

      email:Client emailClient = check new ();
      string sendEmailResponse = check emailClient->sendEmail(recipientAddress, "New Issue Created", "Issue Title: " + issueTitle + " Issue Body: " + issueBody);
      log:printInfo("Email sent to " + recipientAddress + " with response: " + sendEmailResponse);
    }
    remote function onClosed(github:IssuesEvent payload ) returns error? {
      //Not Implemented
    }
    remote function onReopened(github:IssuesEvent payload ) returns error? {
      //Not Implemented
    }
    remote function onAssigned(github:IssuesEvent payload ) returns error? {
      //Not Implemented
    }
    remote function onUnassigned(github:IssuesEvent payload ) returns error? {
      //Not Implemented
    }
    remote function onLabeled(github:IssuesEvent payload ) returns error? {
      //Not Implemented
    }
    remote function onUnlabeled(github:IssuesEvent payload ) returns error? {
      //Not Implemented
    }
}

service /ignore on httpListener {}