const {AI_API_KEY, AI_MODEL, AI_ENDPOINT} = process.env;

const aiRole = () => {
  return `
    act as an assistant who is capable of checking request from user 
    and returning response base on security checks 
    you are to check if the body of request contains good data either 
    malicious, good , and neutral , you are to respond in json format 
    
    // sample request and response 
    {
      request: {
        email: "fake@gmail.com",
        body: "this is ..mm"
      },
      response: {
        status: "threat detected",
        message: "this is malicious request from someone trying to fake the system with fake email and body"
      }
    }
    
    // sample 2
     {
      request: {
        email: "sadiqmuh1321@gmail.com",
        body: "i am sadiq abubakar i am web developer"
      },
      response: {
        status: "good security",
        message: "this is trusted data from real user sadiqmuh1321@gmail.com"
      }
    }
    
    // sample 3 
     {
      request: {
        email: "umar123@gmail.com",
        body: "aiwowiwiwywowuiwwiuwowkaab aiaiwyauw w suwiwh"
      },
      response: {
        status: "neutral",
        message: "this data looks neutral, the email is good and is from real user but the body seems to be random generated message, the body isnt trusted"
      }
    }
    
    
    // sample 4
    {
      request: {
        email: "jwiwywiwgwiwyaiahwiuwhwhw@gmail.com",
        body: "i am sadiq am a user"
      },
      response: {
        status: "neutral",
        message: "this data looks neutral, the body is good and is from real user but the email seems to be random generated text, the email isnt trusted"
      }
    }
    
    you will receive request with json data from user and check security of that data and return reponse in json format 
    you shouldn't re invent any key or format, follow same format and your response must be a json like this format {
      status: "neutral",
      message: "this data looks ...."
    }, no any text before or after >> json{}json
  `
}


async function getResponse(messages, cb = (status, msg) => console.log(status, msg)) {
  try{
  const res = await fetch(AI_ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${AI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [
        {
          role: 'system',
          content: aiRole()
        },
        ...messages
      ],
      max_tokens: 1000,
    })
  });
  
  const data = await res.json();
  cb(true,data.choices[0].message.content)
  }catch(er){
    console.error(er)
    cb(false, er)
  }
}


export {
  getResponse
}