const puppeteer = require('puppeteer');

const fs = require('fs'),
    ejs = require("ejs");

const fhirPath = require('fhirpath');

function ejs2html(path, data) {
    fs.readFile(path, 'utf8', async function (err, content) {
        if (err) { console.log(err); return false; }
        var ejs_string = content,
            template = ejs.compile(ejs_string),
            html = template(data);
        await generatePDF(html);
        fs.writeFile(path + '.html', html, function(err) {
            if(err) { console.log(err); return false }
            return true;
        });  
    });
}

async function generatePDF(html) {
  const browser = await puppeteer.launch();
  // Create a new page
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  // To reflect CSS used for screens instead of print
  await page.emulateMediaType('screen');
  // Generate the PDF
  const pdf = await page.pdf({
    path: '/Users/angshus/work/projects/fhir-pdf/public/op-consult.template.pdf',
    margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
    printBackground: true,
    format: 'A4',
  });
  // Close the browser instance
  await browser.close();
}

// ejs2html(__dirname+"/index.ejs")
var person = {
    name:"Angshuman",
    address:"Klassik Benchmark"
}

var fhirPatient = {
    "resourceType": "Patient",
    "id": "example",
    "address": [
      {
        "use": "home",
        "city": "PleasantVille",
        "type": "both",
        "state": "Vic",
        "line": [
          "534 Erewhon St"
        ],
        "postalCode": "3999",
        "period": {
          "start": "1974-12-25"
        },
        "district": "Rainbow",
        "text": "534 Erewhon St PeasantVille, Rainbow, Vic  3999"
      }
    ],
    "managingOrganization": {
      "reference": "Organization/1"
    },
    "name": [
      {
        "use": "official",
        "given": [
          "Peter",
          "James"
        ],
        "family": "Chalmers"
      },
      {
        "use": "usual",
        "given": [
          "Jim"
        ]
      },
      {
        "use": "maiden",
        "given": [
          "Peter",
          "James"
        ],
        "family": "Windsor",
        "period": {
          "end": "2002"
        }
      }
    ],
    "birthDate": "1974-12-25",
    "deceased": {
      "boolean": false
    },
    "active": true,
    "identifier": [
      {
        "use": "usual",
        "type": {
          "coding": [
            {
              "code": "MR",
              "system": "http://hl7.org/fhir/v2/0203"
            }
          ]
        },
        "value": "12345",
        "period": {
          "start": "2001-05-06"
        },
        "system": "urn:oid:1.2.36.146.595.217.0.1",
        "assigner": {
          "display": "Acme Healthcare"
        }
      }
    ],
    "telecom": [
      {
        "use": "home"
      },
      {
        "use": "work",
        "rank": 1,
        "value": "(03) 5555 6473",
        "system": "phone"
      },
      {
        "use": "mobile",
        "rank": 2,
        "value": "(03) 3410 5613",
        "system": "phone"
      },
      {
        "use": "old",
        "value": "(03) 5555 8834",
        "period": {
          "end": "2014"
        },
        "system": "phone"
      }
    ],
    "gender": "male",
    "contact": [
      {
        "name": {
          "given": [
            "Bénédicte"
          ],
          "family": "du Marché",
          "_family": {
            "extension": [
              {
                "url": "http://hl7.org/fhir/StructureDefinition/humanname-own-prefix",
                "valueString": "VV"
              }
            ]
          }
        },
        "gender": "female",
        "period": {
          "start": "2012"
        },
        "address": {
          "use": "home",
          "city": "PleasantVille",
          "line": [
            "534 Erewhon St"
          ],
          "type": "both",
          "state": "Vic",
          "period": {
            "start": "1974-12-25"
          },
          "district": "Rainbow",
          "postalCode": "3999"
        },
        "telecom": [
          {
            "value": "+33 (237) 998327",
            "system": "phone"
          }
        ],
        "relationship": [
          {
            "coding": [
              {
                "code": "N",
                "system": "http://hl7.org/fhir/v2/0131"
              }
            ]
          }
        ]
      }
    ]
}

ejs2html("/Users/angshus/work/projects/fhir-pdf/public/op-consult.template", { fhirPath: fhirPath, person: person, fhirPatient: fhirPatient } )
//ejs2html("/Users/angshus/work/projects/fhir-pdf/public/op-consult.template", { person: person} )