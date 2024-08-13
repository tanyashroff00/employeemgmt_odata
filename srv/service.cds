using employeemanagement from '../db/data-model';

service EmployeeService @(path: '/odata') {
    entity Employees   as select from employeemanagement.EMPLOYEE;
    entity Professions as projection on employeemanagement.PROFESSION;
    entity Files       as projection on employeemanagement.FILE;
    function readEmployees(EMP_ID : Integer) returns {};
}
