import { error } from "console"

export const formMessages = {
    missingPower: 'על מנת לשלוח טופס תקין, חובה למלא מודל ואת מספר המודלים',
}

export const sysStrings = {
  email: {
    successMessage: 'Email sent successfully',
    failedMessage: 'Failed to send email: ',
    missingInfo: 'file name or receiver is missing!'
  },
  database: {
    saveFailed: 'Saving data failed!',
    error: 'Somthing went worng with DB connection',
  },
}

export const appStrings = {
  email: {
    success: 'המייל נשלח בהצלחה.',
    failed: 'שליחת המייל נכשלה. ודאו שחיבור האינטרנט תקין ונסו שוב.'
  },
  dataSaved: 'הפרטים נשמרו בהצלחה. ',
  dataSavedfailed: '...שמירת הנתונים נכשלה. אנא בדקו את חיבור האינטרנט',
  archive: 'ארכיון',
  clear: 'נקה',
  missigRecords: 'לא נמצאו רשומות מתאימות...',
  attchmentsExists: '..טופס זה כולל תמונות',
  account: {
    invalid: 'פרטי החשבון לא מורשים',    
  },
  connection: {
    fail: 'בדוק את חיבור האינטרנט'
  },
  search: {
    error: 'לא ניתן לחפש רשומות כעת.. נסה שוב מאוחר יותר'
  },
  actionFailed: 'הפעולה נכשלה!',
  saveFailed: 'הפרטים לא נשמרו',
  form: {
    delete: 'הטופס נמחק בהצלחה',
    archive: 'הטופס הועבר לארכיון',
    updateFail: 'סטטוס הטופס לא עודכן',
  },
  storage: {
    uploadFailed: 'העלאת תמונת נכשלה. נסה שוב מאוחר יותר'
  }
  
}

// todo: change name, maybe formBlocksMap
export const formFieldMap = {
    //inspection
    head:['provider'],
    info:['customer', 'invoice', 'address', 'facillity-ls'],
    test: ['amper', 'kw'],
    convertor: ['cunits', 'cpower', 'convertor-ls', 'cmodel'],
    panel: ['punits', 'ppower', 'panel-ls', 'pmodel'],
    techs: ['electrician-ls', 'elicense', 'ephone', 'eemail','planner-ls', 'plicense', 'pphone', 'pemail'],
    data: ['voltl', 'voltn', 'omega', 'pm', 'rcurrent', 'mcurrent', 'check'],
    //storage
    storage: ['batteries','capacity', 'bmanufacture'],
    //elevator
    elevator: ['elevator', 'mainbreaker', 'mainbreakersize', 'officenum', 'checkgrounding', 'checkamper'],
    //charge
    charge: ['station', 'manufacture', 'model', 'power',  'maxcurrent', 'breakersize'],
    //bizpermit
    bizpermit: ['filenum', 'bizname', 'biztype', 'regnum',  'city', 'street', 'addressnum', 'date', 'checkswitch'],
    bizpermittbl: ['tbl_panel_pos-ls', 'tbl_panel_num', 'tbl_panel_ampsize', 'tbl_panel_cut-ls', 'tbl_panel_vis-ls', 'tbl_panel_down-ls'],
    end: ['comments', 'message'],
    signature: ['signature']
    
}

// FormFeilds
export const fieldsNameMap: any = {
    //inspection
    customer: 'שם לקוח',
    invoice: 'מספר הזמנה',
    provider: 'ספק עבודה',
    address: 'כתובת',
    kw: 'הספק הממיר',
    amper: 'גודל חיבור',
    cunits: 'מספר מהפכים',
    cmodel: 'דגם',
    cpower: 'הספק כללי',
    convertor: 'שם יצרן',
    punits: 'מספר מודלים',
    pmodel: 'הספק פאנל',
    panel: 'שם יצרן',
    electrician: 'חשמלאי',
    planner: 'מתכנן',
    voltl: 'מתח שלוב',
    voltn: 'מתח פאזי',
    rcurrent: 'פחת',
    mcurrent: 'זרם זליגה',
    check: 'תקין',
    omega: 'לולאת תקלה',
    pm: 'שיטת הגנה',
    facillity: 'מתקן',
    comments:'הערות',
    message:'הודעה',
    //storage
    batteries: 'כמות סוללות',
    capacity: 'הספק סוללה',
    bmanufacture: 'שם יצרן',
    //elevator
    elevator: 'מספר מעלית',
    mainbreaker: 'מפסק ראשי',
    mainbreakersize: 'גודל מפסק ראשי',
    officenum: 'מספר משרד',
    checkamper: 'גודל המבטח',
    checkgrounding: 'סוג הארקה',
    //charge
    station: 'מספר עמדה',
    manufacture: 'שם היצרן',
    model: 'דגם',
    power: 'הספק',
    maxcurrent: 'זרם מרבי',
    breakersize: 'גודל המספק',
    //bizpermit 
    filenum: 'מספר תיק',
    bizname: 'שם העסק',
    regnum: 'ח.פ',
    biztype: 'מהות העסק',
    city: 'יישוב',
    street: 'רחוב',
    addressnum: 'מס׳',
    checkswitch: 'קיום מפסק',
    setdate: 'תאריך ביקור',
    tbl_panel_num: 'מספר הלוח',
    tbl_panel_pos: 'מיקום הלוח',    
    tbl_panel_ampsize: 'גודל האמפר',
    tbl_panel_cut: 'ניתוק',
    tbl_panel_vis: 'גילוי',
    tbl_panel_down: 'כיבוי',

}

export const facillties = ['מחסן','לול','רפת','גג','תעשייה','מבנה מסחרי','מבנה מגורים'];

export const appDropDwons = ['electrician', 'planner', 'facillity', 'convertor', 'panel'];

const bizpermitOptions: Record<string, string[]> = {
	'tbl_panel_pos-ls': ['בפנים', 'בחוץ'],
	'tbl_panel_cut-ls': ['√', '–'],
	'tbl_panel_vis-ls': ['√', '–'],
	'tbl_panel_down-ls': ['√', '–'],
	'checkswitch': ['חשמל חירום תקין', 'UPS תקין']
  }


export const dropDownOptionsMap: Record<string, typeof bizpermitOptions> = {
	'bizpermit': bizpermitOptions
}

export const checkBoxesEndName: any = {
	'bizpermit': {
		'checkswitch': {
			'חשמל חירום תקין': 'first', 
			'UPS תקין': 'fourth'
		}
	}
}