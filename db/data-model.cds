namespace employeemanagement;

// entity EMPLOYEE {
//     key EMP_ID         : Int32;
//         EMP_NAME       : String(255);
//         EMP_EMAIL      : String(128);
//         EMP_EXPERIANCE : String(50);
//         EMP_SALARY     : String(128);
//         CONTENT        : LargeBinary @Core.MediaType: 'application/pdf';

//         @Core.IsMediaType: true
//         FILE_NAME      : String;
//         URL            : String;
//         EMP_PRO        : Association to one PROFESSION;
// }

entity EMPLOYEE {
    key EMP_ID         : Int32;
        EMP_NAME       : String(255);
        EMP_EMAIL      : String(128);
        EMP_EXPERIANCE : String(50);
        EMP_SALARY     : String(128);
        IMG            : LargeBinary @Core.MediaType: 'image/png';
        IMG_URL        : String;
        FILE           : Association to one FILE
                             on FILE.EMP = $self;
}

entity PROFESSION {
    key PRO_ID   : String(50);
        PRO_LIST : String(255);
}

entity FILE {
    key FILE_ID    : UUID;

        @Core.MediaType  : MEDIA_TYPE
        CONTENT    : LargeBinary;

        @Core.IsMediaType: true
        MEDIA_TYPE : String;
        FILE_NAME  : String;
        URL        : String;
        EMP        : Association to one EMPLOYEE;
};
