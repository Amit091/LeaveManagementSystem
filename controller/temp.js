function createReport(data) {
  let settings = {
    method: 'GET',
    headers: {
      "Authorization": 'Bearer ' + data.token,
      "Content-Type": "application/json"
    },
    url= "https://commission-detail.api.cj.com/v3/commissions?requestor-cid=5095050&date-type=posting",
  };
  async request(settings,
     (err, res, body) => {
      if (!err && res.statusCode == 200) {
        reslove(body)
      } else {
        reject(err)
      }
    })
  })
}



async function createreport(data) {
  let settings = {
    method: 'GET',
    headers: {
      "Authorization": 'Bearer ' + data.token,
      "Content-Type": "application/json"
    },
    url= "https://commission-detail.api.cj.com/v3/commissions?requestor-cid=5095050&date-type=posting",
  };
  let


  try {
    let result = await request(settings, url);
  }
}

try {
  await request({
    method: 'GET',
    url: "https://commission-detail.api.cj.com/v3/commissions?requestor-cid=5095050&date-type=posting",
    headers: {
      "Authorization": 'Bearer ' + data.token,
      "Content-Type": "application/json"

    }
  }, (err, res, body) => {
    if (err) { return console.log(err); }
    if (body.indexOf('</') == -1) {





      async function getreport() {
        var data = {
          token: "62409v276xf7ja2xpw9ej8m2v0"
        }
        var result = await createreport(data);
        console.log("result ", result);
        return result;
      }
      console.log(getreport())
      res.send(getreport());

    }
  }
}

