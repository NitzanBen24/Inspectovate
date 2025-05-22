import { EmberBlock, PdfField } from "@/app/utils/types/formTypes";
import { getImageBase64 } from "../../utils";


const base64String = getImageBase64('davidembersign.png');

export function generateHtml({
    date, 
    formFields,
    blocks,
  }: {
    date: string;
    formFields: PdfField[];    
    blocks: EmberBlock[];
  }) {
    return `
    <html dir="rtl">
      <head>
        <meta charset="utf-8" />
        <style>
            @page { margin: 40px; }
            body { font-family: Arial, sans-serif; padding: 0; }
            .pdf-wrapper { padding: 40px; }
            .block { border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; page-break-inside: avoid; }
            .text-blue { color: #0070c0; }
            .bold-underline {font-weight: bold; text-decoration: underline;}
            .text-bold {font-weight: bold;}
            .text-underline {text-decoration: underline;}
            .section { display: flex; flex-direction: column; }
            .row { display: flex;}
            .mb-6 { margin-bottom: 6px; }
            .mb-8 { margin-bottom: 8px; }
            .mb-16 { margin-bottom: 16px; }
            .mt-10 { margin-top: 10px; }
            .mt-20 { margin-top: 20px; }
            .mt-16 { margin-top: 16px; }
            .mr-4 { margin-right: 4px}
            .mr-6 { margin-right: 6px}
            .mr-20 { margin-right: 20px}
            .ml-4 { margin-left: 4px}
            .last-section { page-break-before: always; }
            .flex-around { display: flex; justify-content: space-around }
        </style>
      </head>
      <body>

        <div class="pdf-wrapper">
    
            <div class="uesr-headline text-blue text-bold">
                <h1 class="" style="font-size: 46px;">אמבר הנדסת חשמל בעמ</h1>
                <h2 class="text-underline" style="font-size: 32px;">תעודת רישום ובדיקה של מתקן חשמל</h2>
                <div style="font-size: 20px;">
                    <p>( ע״פ חוק השחמל תשי״ד 1954 ותקנותיו )</p>
                    <div class="user-details class=""">                        
                        <label>הבודק:</label>
                        <span>${formFields.find(field => field.name === 'pname')?.value || ''}</span>                    
                        <label class="mr-20">מ.ר:</label>
                        <span>${formFields.find(field => field.name === 'plicense')?.value || ''}</span>                                        
                        <br>
                        <label>טל׳:</label>
                        <span>${formFields.find(field => field.name === 'pphone')?.value || ''}</span>
                        <br>
                        <br>
                        <label>Email:</label>
                        <span>${formFields.find(field => field.name === 'pemail')?.value || ''}</span>
                    </div>
                </div>
            </div>

            <div class="inspect-report">
            
                <div class="report-head">
                    <div class="" style="text-align: center;">
                        <h4 class="bold-underline" style="margin-bottom: 2px;">תעודת רישום ובדיקה של מתקן חשמלי</h4>
                        <p style="margin-top: 2px;">(ע״פ חוק השחמל תשי״ד 1954 ותקנותיו)</p>
                    </div>

                    <br>
                    <p style="text-align: center">תאריך הבדיקה: ${date}</p>
                    <br>
                    
                    <div>
                        <div class="row mb-8">
                            <span class="bold-underline ml-4">1.שם המתקן/אתר וכתובתו:</span>
                            <span>${formFields.find(field => field.name === 'site')?.value || ''}</span>
                        </div>
                        <div class="row mb-8">
                            <span class="bold-underline ml-4">שם מזמין הבדיקה:</span>
                            <span>${formFields.find(field => field.name === 'client')?.value || ''}</span>
                        </div>
                    </div>

                    <div class="section">

                        <div class="row mt-16 mb-8">
                            <span class="bold-underline">2.תאור המתקן/אתר:</span>
                        </div>
                        <div class="row mb-8">
                            <span class="ml-4">המתקן:</span>
                            <span class="bold-underline">${formFields.find(field => field.name === 'system')?.value || ''}</span>
                            <span class="ml-4 mr-6">מקום:</span>
                            <span class="bold-underline">${formFields.find(field => field.name === 'location')?.value || ''}</span>                    
                        </div>
                        
                        <div class="row mb-8">                        
                            <span class="ml-4">גודל המבטח מ׳׳ז ראשי:</span>
                            <span class="bold-underline">${formFields.find(field => field.name === 'size')?.value || ''}</span>
                            <span class="ml-4 mr-6">מקור ההזנה:</span>
                            <span class="bold-underline">${formFields.find(field => field.name === 'feedsource')?.value || ''}</span>                    
                        </div>

                    </div>
                    
                </div>       

                <h3>תיאור ההתקנה:</h3>
                

                <div class="report-body">
                    <h3>3. מהליך הבדיקה:</h3>
                    <div class="form-block">
                        ${blocks
                        .map(
                            (b, i) => `
                            <div class="block mt-10">                         
                                <h3>${formFields.find(field => field.name === 'unit')?.value || ''} מספר ${i + 1} ${formFields.find(field => field.name === 'location')?.value || ''}</h3>                      
                                <p>
                                    א. המתקן נבדק לטיב בידוד, בין פאסות אפס והארקה, בעזרת מכשיר <span class="text-bold"> METREL MI3155 </span><span class="text-bold"> 500v dc </span>
                                    ערך של מעל 2 מגה נמצא תקין 
                                </p>
                                <p>
                                    ב. המתקן נבדק לטיב הארקה, בעזרת מכשיר <span class="text-bold"> METREL MI3155 </span>
                                    ונמצא ערך של<span class="bold-underline"> ${b.ohm} </span><span class="text-bold">אוהם </span>
                                    תקין
                                </p>
                                <p>
                                    ג. בוצע בדיקת <span class="text-bold"> RCD</span> במצב <span class="text-bold">RMP </span>
                                    ונמצא ש: פחות מגיב ב- <span class="text-bold">${b.depreciation}</span> 
                                    בזמן של <span class="text-bold">${b.time}</span> ערך תקין.
                                </p>      
                                <p>${b.eboard}</p>                  
                            </div>
                        `
                        )
                        .join('')}
                    </div>
                </div>    

            
            
            <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; margin-top: 40px; margin-botto: 30px;">
                <p>הנני לאשר שכל העבודות בוצעו בהתאם להוראות חוק החשמל תשי"ד והתקנות שפורסמו על פיו, תקני מכון התקנים הישראלי הנוגעים למתקני צריכה חשמליים בהתאם לכללי חברת החשמל לישראל בע"מ, המתייחסים להספקת חשמל לצרכנים.</p>
                <p>בדו"ח זה לא נבדקו מכשירי חשמל מטלטלים/ ניידים המחוברים לבתי תקע ומכשירים נוספים המחוברים למתקן.</p>
                <p><strong>6. מסקנה</strong></p>
                <p>הנני מאשר כי מתקן החשמל הקבוע כפי שנבדק למעט אביזרים וציוד חשמלי קבוע או מיטלטל, באתר המתואר לעיל נבדק ונמצא תקין במועד ביצוע בדיקה זו ומתאים לדרישות חוק החשמל והתקנות – ולכן אני מאשר את המשך השימוש במערכת החשמל.</p>
                <h4>6. תנאים ומגבלות:</h4>
                <ul>
                <li>6.1 תוקף הבדיקה ותוצאותיה נכונים אך ורק ליום הבדיקה , ואין הבודק אחראי לכל שינוי שלא על דעתו.</li>
                <li>6.2 ממצאי הבדיקה משקפים את מצב המערכת הנבדקת ביום הבדיקה בלבד.</li>
                <li>6.3 הבדיקה איננה מתייחסת לנזקים העלולים להיגרם למערכת כתוצאה מכוח עליון ולרבות ברקים, הפרעות אלקטרומגנטיות, אש, רצפה רטובה, נזילות מים, חדירת מים, וכו'.</li>
                <li>6.4 הבדיקה איננה מתייחסת למרכיבים נסתרים של המערכת הנבדקת, שלא ניתן לבדקם בעין או באמצעות מכשירי מדידה.</li>
                <li>6.5 הבדיקה איננה כוללת מערכות מיזוג אויר, מפוחים, כיבוי וגילוי אש, מחשבים, תקשורת ומערכות מנ"מ.</li>
                <li>6.6 הבדיקה איננה חלה על שינויים ותוספות למערכת הנבדקת, אשר יבוצעו ממועד הבדיקה ואילך.</li>
                <li>6.7 נתוני המבטח הראשי (גודל החיבור) הינם הנתונים הקיימים בפועל ולא מהווים אישור על חוקיות גודל החיבור הניתן ע"י חברת החשמל.</li>
                </ul>
                <h4>7. הוראות בטיחות כלליות ודרכי תחזוקה מונעת:</h4>
                <ul>
                <li>7.1 אין לעקוף ממסרי פחת בכל מצב.</li>
                <li>7.2 לבצע ניקיון וחיזוק ברגים ובדיקה תרמוגרפית ללוחות החשמל - לפחות פעם בשנה.</li>
                <li>7.3 לבצע בדיקת מערכת הארקה, בידוד, לולאת תקלה ובדיקה ויזואלית - לפחות פעם בשנה.</li>
                <li>7.4 בכל שינוי במתקן יש להזמין בדיקה ואישור ביצוע ע"י חשמלאי בעל רישיון מתאים.</li>
                </ul>
            </div>
            
            <div class="section mt-20">
                <p class="bold-underline">לאחר בדיקת התוצאות אשר התקבלו הריני מאשר מתקן זה</p>
                <div class="row">
                    <div class="section">
                        <span class="text-bold mb-6">בברכה</span>
                        <span class="text-bold"> ${formFields.find(field => field.name === 'pname')?.value || ''}</span>
                        <span class="text-bold">בודק חשמל מוסמך</span>
                        <span class="text-bold mb-6"></span>
                        <span class="">רישיון בודק מס׳ </span><span class="text-bold"> ${formFields.find(field => field.name === 'plicense')?.value || ''}</span>
                    </div>
                    <div class="section">
                        <img src="data:image/png;base64,${base64String}" style="width: 200px;" />
                    </div>
                </div>
            </div>

            </div>
        
        </div>

      </body>
    </html>
    `;
  }
  
  

  