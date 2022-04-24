export function convertNullToDate() {
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1;
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    return new Date(year + '-' + month + "-" + day)

}

export function getOldestPair(event, setState) {
    let pairsProjectId = {};
    let csvOutput = event.target.result;
    // Sanitize input and convert to array
    // Input is expected to have the names of the columns, so we have the shift() else we get Invalid Date
    // After the split the last element is an empty string, so we have the pop()
    let data = csvOutput.split("\r\n");
    data.pop();
    data.shift();


    // Get Pairs with same Project Id that overlap in date range
    //Outer loop through all employees
    for (let i = 0; i < data.length - 1; i++) {
        let item = data[i];
        let [employeeId, projectId, dateFrom, dateTo] = item.split(',')
        dateFrom = new Date(dateFrom);
        dateTo === 'NULL' ? dateTo = convertNullToDate() : dateTo = new Date(dateTo)
        //For every iteration of an employee on the outer loop, do a nested loop through all employees to check for pairs
        for (let j = i + 1; j < data.length; j++) {
            let nestedItem = data[j];
            let [employeeIdNested, projectIdNested, dateFromNested, dateToNested] = nestedItem.split(',');
            dateFromNested = new Date(dateFromNested);
            dateToNested === 'NULL' ? dateToNested = convertNullToDate() : dateToNested = new Date(dateToNested);

            //Check if two employees have same projectId
            if (projectId === projectIdNested) {

                //Check if start and end dates for both employees are valid (startDate < endDate)
                if (dateFrom <= dateTo && dateFromNested <= dateToNested) {

                    //Check if there is an overlap for those employees in the project (startA <= endB && endA >= startB)
                    if (dateFrom <= dateToNested && dateTo >= dateFromNested) {
                        const MS_PER_DAY = 1000 * 60 * 60 * 24;

                        function dateDiffInDays(a, b) {
                            const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
                            const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
                            return Math.floor((utc2 - utc1) / MS_PER_DAY);
                        }

                        //Find the duration of the time paired on a project
                        const a = dateFrom >= dateFromNested ? dateFrom : dateFromNested,
                            b = dateTo <= dateToNested ? dateTo : dateToNested,
                            difference = dateDiffInDays(a, b);

                        let pairId = `${employeeId} - ${employeeIdNested}`

                        if (!(pairId in pairsProjectId)) {
                            pairsProjectId[pairId] = {
                                timePaired: difference,
                                commonProjects: [{ [projectId]: difference }]
                            }
                        } else {
                            pairsProjectId[pairId].timePaired += difference
                            pairsProjectId[pairId].commonProjects.push({ [projectId]: difference })
                        }

                    }
                }

            }
        }
    }

    let sorted = Object.entries(pairsProjectId).sort((a, b) => b[1].timePaired - a[1].timePaired)

    const longestPair = sorted[0]

    setState(longestPair)

}
