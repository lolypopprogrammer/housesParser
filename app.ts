interface IParsedObject {
    even: number,
    odd: number,
    listEven: (number|string)[],
    listOdd: (number|string)[]
}

class HousesParser {

    parsedObject: IParsedObject = {even: 0, listEven: [], listOdd: [], odd: 0};


    constructor(private readonly source: string) {
        let houseString: string = source.toLowerCase().replace(/\s/g, '');

        const regDiapason = /(нечетные|четные)((\d+)-(\d+))/g;
        const regInfinite = /(нечетные|четные)((\d+)\+)/g;
        const regFromTo = /(нечетные|четные)[с](\d+)[и]/g;

        const regAllDiapason = /((\d+)-(\d+))/g;

        let diapason, infinite;

        if (regDiapason.test(houseString)) {
            diapason = houseString.match(regDiapason);

            diapason.forEach((house: string) => {
                const houseNumberList = house.replace(/\W+/, '');
                const splitHouseList = houseNumberList.split('-');

                let list: number[] = [];

                for (let i = +splitHouseList[0]; i <= +splitHouseList[1]; i += 2) {
                    list.push(i);
                }

                this.isEven(house) ? this.parsedObject.listEven = list : this.parsedObject.listOdd = list;
            });

            houseString = houseString.replace(regDiapason, '');
        }

        if (regInfinite.test(houseString)) {
            infinite = houseString.match(regInfinite);

            infinite.forEach((house: string) => {
                const houseNumber = +house.replace(/(\W+)/, '').replace('+', '');
                this.isEven(house) ? this.parsedObject.even = houseNumber : this.parsedObject.odd = houseNumber;
            });

            houseString = houseString.replace(regInfinite, '');
        }

        if (regFromTo.test(houseString)) {
            infinite = houseString.match(regFromTo);

            infinite.forEach((house: string) => {
                const houseNumber = +house.replace(/(\W+)/g, '');
                this.isEven(house) ? this.parsedObject.even = houseNumber : this.parsedObject.odd = houseNumber;
            });

            houseString = houseString.replace(regFromTo, '');
        }

        houseString.replace(/[А-Яа-я]/g, '').split(',').forEach((houseNumber: string) => {
            if (regAllDiapason.test(houseNumber)) {
                const splitHouseNumber = houseNumber.split('-');

                for (let i = +splitHouseNumber[0]; i <= +splitHouseNumber[1]; i++) {
                    if (this.isEvenNumber(i)) {
                        this.parsedObject.listEven.indexOf(i) === -1 ? this.parsedObject.listEven.push(i) : 1;
                    } else {
                        this.parsedObject.listOdd.indexOf(i) === -1 ? this.parsedObject.listOdd.push(i) : 1;
                    }
                }
            } else if (houseNumber) {
                this.isEvenNumber(+houseNumber) ?
                    this.parsedObject.listEven.push(houseNumber) :
                    this.parsedObject.listOdd.push(houseNumber)
            }
        });

    }

    private isEven = (houseList: string): boolean => !(houseList.indexOf('не') != -1);

    private isEvenNumber = (number: number): boolean => number % 2 === 0;

    isHouseIncluded(houseNumber: string): boolean {
        if (this.isEvenNumber(+houseNumber)) {
            if (this.parsedObject.listEven.indexOf(houseNumber) !== -1) {
                return true;
            }
            return this.parsedObject.even < +houseNumber && this.parsedObject.even !== 0;

        } else {
            if (this.parsedObject.listOdd.indexOf(houseNumber) !== -1) {
                return true;
            }
            return  this.parsedObject.odd < +houseNumber && this.parsedObject.odd !== 0;
        }
    }
}

console.log(new HousesParser('четные с 14 и вся улица, нечетные с 33 и вся улица, 1, 2, 17/a, 12-16,').isHouseIncluded('17/a'));
console.log(new HousesParser('четные 2-28, нечетные 1-21').isHouseIncluded('55'));
console.log(new HousesParser('четные 2-28; нечетные 1-21').isHouseIncluded('55'));
console.log(new HousesParser('четные 2-28 нечетные 1-21').isHouseIncluded('24'));
console.log(new HousesParser('четные2-28нечетные1-21').isHouseIncluded('55'));
console.log(new HousesParser('четные2-28нечетные1+').isHouseIncluded('55'));
