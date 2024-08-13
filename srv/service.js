const cds = require("@sap/cds");
// const { employee } = require("./employeeCustomHandelers");

module.exports = (srv => {
    let { Employees, Files } = srv.entities;

    srv.on("readEmployees", async (req) => {
        let db = await cds.connect.to('db');
        let tx = db.tx();
        try {
            // let sQuery = 
            // `SELECT E."EMP_ID",E."EMP_NAME",E."EMP_EMAIL",E."EMP_EXPERIANCE",E."EMP_SALARY",E."IMG",E."IMG_URL",F."FILE_ID",F."CONTENT",F."MEDIA_TYPE",F."FILE_NAME",F."URL",F."EMP_EMP_ID"
            // FROM ${Employees} AS E 
            // JOIN ${Files} AS F ON E."EMP_ID"=F."EMP_EMP_ID" 
            // WHERE E."EMP_ID"=${req.data.EMP_ID}`;
            let sQuery = `SELECT EMP_ID,EMP_NAME,EMP_EMAIL,EMP_EXPERIANCE,EMP_SALARY,IMG,IMG_URL FROM ${Employees} WHERE EMP_ID = ${req.data.EMP_ID}`;
            let aEmployee = await tx.run(sQuery);
            let aImgData = aEmployee[0].IMG;
            let sImgStr = toBase64(aImgData);
            if(aEmployee[0].CONTENT){
                let sCVStr = toBase64(aEmployee[0].CONTENT);
                aEmployee[0].CV_STR = `data:application/pdf;base64,` + sCVStr;
            }
            aEmployee[0].IMG_STR = `data:image/png;base64,` + sImgStr;
            let oEmployee = {
                "status": "OK",
                "results": aEmployee
            };
            const { res } = req.http;
            res.send(oEmployee);
        } catch (e) {
            await tx.rollback(e)
        }
    });

    function toBase64(arr) {
        return btoa(
            arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
    }

    srv.before("CREATE", Employees, async (req) => {
        let db = await cds.connect.to('db');
        let tx = db.tx();
        try {
            let sMaxIdQuery = `SELECT MAX(EMP_ID) AS ID FROM ${Employees}`;
            let iTableCount = await tx.run(sMaxIdQuery);
            req.data.EMP_ID = iTableCount[0].ID + 1;
            if (req.data.IMG) {
                if (typeof req.data.IMG === 'string') {
                    req.data.IMG = Buffer.from(req.data.IMG, 'base64');
                }
            }
        } catch (e) {
            console.log(e);
        }
        var sVersion = req.req.headers['x-cds-odata-version'];
        req.data.IMG_URL = sVersion === "v2" ? `/v2/odata/Employees(${req.data.EMP_ID})/IMG` : `/odata/Employees(${req.data.EMP_ID})/IMG`;
    });

    srv.before("DELETE", Employees, async (req) => {
        let { res } = req.http;
        let oEmployeeObj = {
            "sMessage": "Employee deleted successfully!",
            "sDeepMessage": `Employee ${req.data.EMP_ID} deleted successfully!`
        };
        res.send(oEmployeeObj);
    });

    srv.before("CREATE", Files, async (req) => {
        var sVesrion = req.req.headers['x-cds-odata-version'];
        if (req.data.CONTENT) {
            try {
                if (typeof req.data.CONTENT === 'string') {
                    req.data.CONTENT = Buffer.from(req.data.CONTENT, 'base64')
                }
            } catch (error) { }
        }
        if (sVesrion === "v2") {
            req.data.URL = `/v2/odata/Files(${req.data.FILE_ID})/CONTENT`;
        } else {
            req.data.URL = `/odata/Files(${req.data.FILE_ID})/CONTENT`;

        }
    });
});