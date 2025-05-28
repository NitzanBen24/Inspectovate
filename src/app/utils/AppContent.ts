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
  },
  schindler: {
    fail: 'בדיקה לא עברה, אלו הם הליקויים:\n\n'
  }
  
}

// todo: change name, maybe formBlocksMap
export const formFieldMap: Record<string, string[]> = {
    //inspection
    head:['provider'],
    info:['customer', 'invoice', 'address', 'facillity-ls'],
    test: ['amper', 'kw'],
    convertor: ['cunits', 'cpower', 'convertor-ls', 'cmodel'],
    panel: ['punits', 'ppower', 'panel-ls', 'pmodel'],
    techs: ['electrician-ls', 'elicense', 'ephone', 'eemail','planner-ls', 'plicense', 'pphone', 'pemail'],
    data: ['voltl', 'voltn', 'omega', 'pm', 'rcurrent', 'mcurrent'],
    //storage
    storage: ['batteries','capacity', 'bmanufacture'],
    //elevator
    elevator: ['elevator', 'mainbreaker', 'mainbreakersize', 'officenum', 'checkgrounding', 'checkamper'],
    //charge
    charge: ['station', 'manufacture', 'model', 'power',  'maxcurrent', 'breakersize'],
    //permit
    permitbiz: ['filenum', 'bizname', 'biztype', 'regnum',  'city', 'street', 'addressnum'],//, 'setdate', 'checkswitch'    
    permitcontact: ['contactname','contactrole', 'contactphone', 'contactemail'],
	  permitrest: ['inspectorname','inspectorid', 'confirmnum', 'setdate', 'checkswitch', 'checkfirehoses'],
	
    //tables	
    //workpermit & bizpermit
    workpermittbl: ['tbl_panel_pos-ls', 'tbl_panel_num', 'tbl_panel_ampsize', 'tbl_panel_cut-ls', 'tbl_panel_vis-ls', 'tbl_panel_down-ls'],
    //firehoses
    firehosestbl: ['tbl_stationnum', 'tbl_stationpos','tbl_dash-ls', 'tbl_eqcabinet-ls', 'tbl_fireroller-ls', 'tbl_fabrichose-ls', 'tbl_comments'],
      //fireequip
    extinguisher: ['tbl_serialnum', 'tbl_extinguisherpos', 'tbl_extinguishertype', 'tbl_nominalsize', 'tbl_extingmanu', 'tbl_duedateins', 'tbl_duedatepre', 'tbl_pass', 'tbl_fail', 'tbl_comment'],
    end: ['comments', 'message'],
    signature: ['signature'],
}

export const tblFormFieldMap: Record<string, string[]> = {
	//bizpermit
	bizpermittbl: ['tbl_panel_pos-ls', 'tbl_panel_num', 'tbl_panel_ampsize', 'tbl_panel_cut-ls', 'tbl_panel_vis-ls', 'tbl_panel_down-ls'],
	//workpermit
	workpermittbl: ['tbl_panel_pos-ls', 'tbl_panel_num', 'tbl_panel_ampsize', 'tbl_panel_cut-ls', 'tbl_panel_vis-ls', 'tbl_panel_down-ls'],
	//firehoses
	firehosestbl: ['tbl_stationnum', 'tbl_stationpos','tbl_dash-ls', 'tbl_eqcabinet-ls', 'tbl_fireroller-ls', 'tbl_fabrichose-ls', 'tbl_comments'],
	//fireequip
	fireequiptbl: ['tbl_serialnum', 'tbl_extinguisherpos', 'tbl_extinguishertype', 'tbl_nominalsize', 'tbl_extingmanu', 'tbl_duedateins', 'tbl_duedatepre', 'tbl_pass', 'tbl_fail', 'tbl_comment'],
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
    ephone: 'טל׳ חשמלאי',
    eemail: 'מייל חשמלאי',
    elicense: 'ריש׳ חשמלאי',
    planner: 'מתכנן',
    pphone: 'טל׳ מתכנן',
    pemail: 'מייל מתכנן',
    plicense: 'ריש׳ מתכנן',
    voltl: 'מתח שלוב',
    voltn: 'מתח פאזי',
    rcurrent: 'פחת',
    mcurrent: 'זרם זליגה',
    // check: 'תקין',
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
	//permit tbl
    tbl_panel_num: 'מספר הלוח',
    tbl_panel_pos: 'מיקום הלוח',    
    tbl_panel_ampsize: 'גודל האמפר',
    tbl_panel_cut: 'ניתוק',
    tbl_panel_vis: 'גילוי',
    tbl_panel_down: 'כיבוי',
    tbl_stationnum: 'מספר עמדה',
    tbl_stationpos: 'מיקום עמדה',

    tbl_dash: 'זרנוק בד 2',
    tbl_fabrichose:'מזנק 2',
    tbl_eqcabinet: 'ארון ציוד',
    tbl_fireroller: 'גלגלון כיבוי',
    tbl_comments: 'הערות',
	
	tbl_serialnum: 'מספר מטפה',
	tbl_extinguisherpos: 'מיקום מטפה',
	tbl_extinguishertype: 'סוג מטפה',
	tbl_nominalsize: 'גודל נומינלי',
	tbl_extingmanu: 'יצרן המטפה',
	tbl_duedateins: 'מועד יסודית הבאה',
	tbl_duedatepre: 'מועד לחץ הבאה',
	tbl_pass: 'תקין',
	tbl_fail: 'לא תקין',
	tbl_comment: 'הערות',
	//permit
	checkfirehoses:'מטף כיבוי',
	inspectorname: 'שם הבודק',
	inspectorid: 'ת.ז',
	contactname: 'איש קשר',
	contactrole: 'תפקיד',
	contactphone: 'מס׳ נייד',
	contactemail: 'כתובת דואל',
	confirmnum: 'מספר אישור',

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

const workpermitOption: Record<string, string[]> = {
	'tbl_panel_pos-ls': ['בפנים', 'בחוץ'],
	'tbl_panel_cut-ls': ['√', '–'],
	'tbl_panel_vis-ls': ['√', '–'],
	'tbl_panel_down-ls': ['√', '–'],
	'checkswitch': ['חשמל חירום תקין', 'חשמל חירום לא תקין', 'לא קיים', 'UPS תקין', 'UPS לא תקין', 'UPS לא קיים']
}

const firehosesOptions: Record<string, string[]> = {
  'tbl_dash-ls': ['קיים', 'לא קיים'],
  'tbl_fireroller-ls': ['קיים', 'לא קיים'],
  'tbl_eqcabinet-ls': ['קיים', 'לא קיים'],
  'tbl_fabrichose-ls': ['קיים', 'לא קיים'],
  'checkfirehoses': ['זרנוקים', 'מצמדים', 'מזנקים', 'גלגלונים', 'אחר']
  
}

export const dropDownOptionsMap: Record<string, typeof bizpermitOptions> = {
	'bizpermit': bizpermitOptions,
	'workpermit': workpermitOption,
  	'firehoses': firehosesOptions,
}

export const checkBoxesValue: any = {
	'bizpermit': {
		'checkswitch': {
			'חשמל חירום תקין': 'first', 
			'UPS תקין': 'fourth'
		}
	},
	'workpermit': {
		'checkswitch': {
			'חשמל חירום תקין': 'a',
			'חשמל חירום לא תקין': 'b',
			'לא קיים': 'c',
			'UPS תקין': 'd',
			'UPS לא תקין': 'e',
			'UPS לא קיים': 'f',
		}
	},
  	'firehoses': {
		'checkfirehoses': {
			'זרנוקים': 'a',
			'מצמדים': 'b',
			'מזנקים': 'c',
			'גלגלונים': 'd',
			'אחר': 'e',
		}
  	}
  
}