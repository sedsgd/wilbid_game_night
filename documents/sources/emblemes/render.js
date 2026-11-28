const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:364,height:364}});
for(const k of ['accueil','repas','pause','classement','gains','ambiance','kongossa']){await p.setContent(`<html><body style="margin:0">${fs.readFileSync('/tmp/emb/em-'+k+'.svg','utf8')}</body></html>`);await p.screenshot({path:`/tmp/emb/em-${k}.jpg`,type:'jpeg',quality:90});}
await b.close()})();
