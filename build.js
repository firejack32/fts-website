// Simple build script: reads _data/site.json and injects content into index.html
const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('_data/site.json', 'utf8'));
let html = fs.readFileSync('home.html', 'utf8');

const c = data.company;
const h = data.homepage;

// Company info
html = html.replace('Info@FireTeamSecurity.com', c.email);
html = html.replace('888.446.7416', c.phone);
html = html.replace('After Hours: 800.299.9900', 'After Hours: ' + c.afterHoursPhone);
html = html.replace(
  'mailto:cheris@fireteamsecurity.com',
  'mailto:' + c.serviceRequestEmail
);

// Hero slides — rebuild the slider section
let slidesHtml = '';
h.slides.forEach(function(slide) {
  slidesHtml += `
    <div class="slider-item" style="background-image:url(${slide.backgroundImage});">
      <div class="overlay"></div>
      <div class="container">
        <div class="row no-gutters slider-text align-items-center justify-content-start" data-scrollax-parent="true">
        <div class="col-md-7 ftco-animate">
          <span class="subheading">${slide.subtitle || ''}</span>
          <h1 class="mb-4">${slide.title}</h1>
          <p><a href="${slide.buttonLink}" class="btn btn-primary px-4 py-3 mt-3">${slide.buttonText}</a></p>
        </div>
      </div>
      </div>
    </div>`;
});
html = html.replace(
  /<section class="home-slider owl-carousel">[\s\S]*?<\/section>/,
  '<section class="home-slider owl-carousel">' + slidesHtml + '\n    </section>'
);

// About section
html = html.replace(/<h3>FTS<\/h3>/, '<h3>' + h.aboutSection.heading + '</h3>');
html = html.replace(
  'Fire Team Security, Inc. is a full service system integrator.',
  h.aboutSection.description
);
html = html.replace(
  'Please consult a Sales Representative for details.',
  h.aboutSection.subtext
);

// Services heading
html = html.replace('Our Security Services', h.servicesHeading);
html = html.replace(
  'As a full service Security Integrator, here are a few of our areas of expertise.',
  h.servicesSubtext
);

// Service items
if (h.services && h.services.length >= 4) {
  html = html.replace('>Video Surveillance<', '>' + h.services[0].name + '<');
  html = html.replace('Avigilon | AVA', h.services[0].brands);
  html = html.replace('>Access Control<', '>' + h.services[1].name + '<');
  html = html.replace('Avigilon | Open Path | Salto', h.services[1].brands);
  html = html.replace('>Fire Alarm Systems<', '>' + h.services[2].name + '<');
  html = html.replace('Siemens | Firelite | Silent Knight | AES', h.services[2].brands);
  html = html.replace('>Intrusion Security<', '>' + h.services[3].name + '<');
  html = html.replace('DMP | Bosch', h.services[3].brands);
}

// Banner text
html = html.replace(
  'You Always Get the Best Results',
  h.bannerText
);

// Stats
if (h.stats && h.stats.length >= 4) {
  html = html.replace('data-number="3654"', 'data-number="' + h.stats[0].number + '"');
  html = html.replace('>Projects Completed<', '>' + h.stats[0].label + '<');
  html = html.replace('data-number="1282"', 'data-number="' + h.stats[1].number + '"');
  html = html.replace('>Satisfied Customer<', '>' + h.stats[1].label + '<');
  html = html.replace('data-number="57"', 'data-number="' + h.stats[2].number + '"');
  html = html.replace('>Licenses Held<', '>' + h.stats[2].label + '<');
  html = html.replace('data-number="35"', 'data-number="' + h.stats[3].number + '"');
  html = html.replace('>Years of Experienced<', '>' + h.stats[3].label + '<');
}

// Quote section
html = html.replace('>Request a Quote<', '>' + h.quoteSection.heading + '<');
html = html.replace(
  'Fill out the information below and a representative from Fire Team Security will get back with you shortly.',
  h.quoteSection.description
);

// Add Identity widget to head
html = html.replace(
  '</head>',
  '    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>\n  </head>'
);

// Add login redirect script and edit button after <body>
html = html.replace(
  '<body>',
  `<body>
    <script>
      if (window.netlifyIdentity) {
        window.netlifyIdentity.on("init", function(user) {
          if (!user) {
            window.netlifyIdentity.on("login", function() {
              document.location.href = "/admin/";
            });
          } else {
            var btn = document.createElement("a");
            btn.href = "/admin/";
            btn.textContent = "Edit Site";
            btn.style.cssText = "position:fixed;bottom:20px;right:20px;z-index:99999;background:#00c7b7;color:#fff;padding:10px 20px;border-radius:6px;font-family:sans-serif;font-size:14px;font-weight:bold;text-decoration:none;box-shadow:0 2px 8px rgba(0,0,0,0.3);";
            document.body.appendChild(btn);
          }
        });
      }
    </script>`
);

// Write the built file as index.html
fs.writeFileSync('index.html', html, 'utf8');
console.log('Built index.html from home.html + _data/site.json');
