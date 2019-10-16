// alert("Here we are!");
/**
 * 
 * @param {Number} numb 
 * @param {Number} pow 
 * @param {Number} mod 
 */
function Power(numb, pow, mod = Number.POSITIVE_INFINITY) {
    var ret = 1;
    for (var i = 0; i < pow; i++) {
        ret = (ret * numb) % mod;
    }
    return ret;
}
/**
 * 
 * @param {Number} numb 
 * @param {Number} mod 
 */
function Order(numb, mod) {
    var i = numb;
    var ret = 1;
    while (i !== 1) {
        ret++;
        i = (i * numb) % mod;
    }
    return ret;
}
/**
 * 
 * @param {Number} numb
 * @returns {Array<Number>}
 */
function PrimeFactors(numb) {
    var ret = [];
    var primes = [];
    var n = numb;

    if (numb == 1) {
        ret.push(1);
        return ret;
    }

    if (primes.length == 0 || primes[primes.length - 1] < numb) {
        for (var i = 2; i <= numb; i++) {
            primes.push(i);
        }
        for (var i = 0; i < primes.length; i++) {
            primes = primes.filter(function (v, inx) { return inx <= i || v % primes[i] != 0; });
        }
    }
    while (n > 1) {
        for (var i = 0; i < primes.length; i++) {
            if (n % primes[i] == 0) {
                n = n / primes[i];
                ret.push(primes[i]);
                break;
            }
        }
    }
    var p = 1;
    ret.forEach((v) => { p *= v; });
    console.assert(p == numb, "Prime factors product equals given number");
    return ret;
}
/**
 * 
 * @param {Number} numb 
 * @param {Array<number>} primes
 */
function Euler(numb, primes) {
    if (primes == undefined) {
        primes = PrimeFactors(numb);
    }
    var p = 1;
    primes.forEach((v) => { p *= v; });
    console.assert(p == numb, "Prime factors product equals given number");
    var ret = 1;
    for (var i = 0; i < primes.length; i++) {
        var prime = primes[i];
        var pow = 1;
        for (var j = i + 1; j < primes.length; j++) {
            if (primes[j] == prime) {
                pow++;
                i++;
            }
            else {
                break;
            }
        }
        ret *= Math.pow(prime, pow - 1) * (prime - 1);
    }
    return ret;
}
console.log("Copyright (c) 2019 Gleb Kosiachenko\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.)");
/**
 * 
 * @param {Array<Number>} factorization 
 * @returns {Array<Array<Number>>}
 */
function PoweredPrimeFactors(factorization) {
    var mid = factorization.map((v) => { return [v, 1]; });
    for (var i = 0; i < mid.length; i++) {
        var pow = 1;
        var init = i;
        for (var j = i + 1; j < mid.length; j++) {
            if (mid[i][0] == mid[j][0]) {
                pow++;
                i++;
            }
        }
        for (var j = init; j <= i; j++) {
            mid[j][1] = pow;
        }
    }
    var ret = [];
    mid.forEach((v) => {
        var contains = false;
        ret.forEach((rv) => {
            if (rv[0] == v[0]) {
                contains = true;
            }
        });
        if (!contains)
            ret.push(v);
    });
    return ret;
}

/**
 * 
 * @param {Array<Number>} numbs 
 */
function LCM(numbs) {
    var primeFactorizations = [];
    var primes = [];
    //TODO: use PoweredPrimeFactors function
    numbs.forEach((v) => { primeFactorizations.push(PrimeFactors(v)); });
    primeFactorizations.forEach((factors) => {
        factors.forEach((v) => {
            var contains = false;
            for (var i = 0; i < primes.length; i++) {
                if (primes[i] == v) {
                    contains = true;
                    break;
                }
            }
            if (!contains) {
                primes.push(v);
            }
        });
    }); //select distinct prime factors into primes
    pows = primes.map((v) => {
        var maxpow = 1;
        primeFactorizations.forEach((factors) => {
            var pow = 0;
            factors.forEach((factor) => {
                if (factor == v) pow++;
            });
            if (pow > maxpow) maxpow = pow;
        });
        return maxpow;
    }); //count maximum powers for each prime factor from each factorization 
    var lcm = 1;
    for (var i = 0; i < pows.length && i < primes.length; i++) {
        lcm *= Math.pow(primes[i], pows[i]);
    }
    var divides = true;
    numbs.forEach((v) => {
        if (lcm % v != 0)
            divides = false;
    });
    console.assert(divides, "LCM is divisible by each of the given numbers");
    return lcm;
}

/**
 * 
 * @param {Number} numb 
 * @param {Array<Number>} primes
 */
function GenericEuler(numb, primes) {
    if (primes == undefined) {
        primes = PrimeFactors(numb);
    }
    var product = 1;
    primes.forEach((v) => { product *= v; });
    console.assert(product == numb);


    return LCM(PoweredPrimeFactors(primes).map((v) => {
        return Euler(Math.pow(v[0], v[1]));
    }));
}
/**
 * 
 * @param {Number} modulo 
 */
function MakeMultiplicativeGroup(modulo) {
    var factorization = PoweredPrimeFactors(PrimeFactors(modulo));
    var group = [1];
    for (var i = 2; i < modulo; i++) {
        var divides = false;
        factorization.forEach((v) => {
            if (i % v[0] == 0)
                divides = true;
        });
        if (!divides) {
            group.push(i);
        }
    }
    return group;
}

var needTesting = true; //true to enable assertions
if (needTesting) {
    console.assert(Order(1, 17) == 0, "Order of 1");

    console.assert(MakeMultiplicativeGroup(11 * 13).length == Euler(11 * 13), "length of multiplicative group equals Euler(modulus)");
    console.assert(MakeMultiplicativeGroup(7 * 5).length == Euler(7 * 5), "length of multiplicative group equals Euler(modulus)");
    console.assert(MakeMultiplicativeGroup(31).length == Euler(31), "length of multiplicative group equals Euler(modulus)");

    console.assert(Euler(15) == 8, "Unit testing");
    console.assert(Euler(1) == 0, "Unit testing");
    console.assert(Euler(8) == 4, "Unit testing");
    console.assert(Euler(21) == 12, "Unit testing");
    console.assert(Euler(16) == 8, "Euler 16");
    console.assert(Euler(81) == 54, "Euler 81");
    console.assert(Euler(253) == 220, "Euler 253");
    console.assert(Euler(110) == 40, "Euler 110");

    /**
     * 
     * @param {Array<T>} lhs 
     * @param {Array<T>} rhs 
     * @param {function} pred
     */
    var arrcmp = (lhs, rhs, pred = (l, r) => { return l == r; }) => {
        if (lhs.length != rhs.length)
            return false;

        for (var i = 0; i < lhs.length; i++) {
            if (!pred(lhs[i], rhs[i]))
                return false;
        }
        return true;
    }
    console.assert(arrcmp(PoweredPrimeFactors(PrimeFactors(72)), [[2, 3], [3, 2]], arrcmp));
    console.assert(arrcmp(PoweredPrimeFactors(PrimeFactors(32)), [[2, 5]], arrcmp));

    console.assert(LCM([3, 15]) == 15, "LCM 3 15");
    console.assert(LCM([1, 1]) == 1, "LCM 1 1");
    console.assert(LCM([16, 16]) == 16, "LCM 16 16");
    console.assert(LCM([10, 15]) == 30, "LCM 10 15");
    console.assert(LCM([12, 7]) == LCM([7, 12]), "LCM order");
    console.assert(LCM([8, 7, 14, 24]) == LCM([24, 7, 8, 14]), "multiple LCM oreder");

    console.assert(GenericEuler(35) == 12, "Generic Euler 35");
    console.assert(GenericEuler(110) == 20, "Generic Euler 110");
    console.assert(GenericEuler(253) == 110, "Generic Euler 110");
    console.assert(GenericEuler(209) == 90, "Generic Euler 209");
    console.assert(GenericEuler(90) == 12, "Generic Euler 90");
    console.assert(GenericEuler(2) == 1, "Generic Euler 2");
    console.assert(GenericEuler(5) == 4, "Generic Euler 5");
    console.assert(GenericEuler(125) == Euler(125), "Generic Euler 125");

    console.assert(arrcmp(PrimeFactors(1), [1]), "Prime factors of 1");
    console.assert(arrcmp(PrimeFactors(6), [2, 3]), "Prime factors of 6");
    console.assert(arrcmp(PrimeFactors(4), [2, 2]), "Prime factors of 4");
    console.assert(arrcmp(PrimeFactors(16), [2, 2, 2, 2]), "Prime factors of 16");
    console.assert(arrcmp(PrimeFactors(19), [19]), "Prime factors of 19");
    console.assert(arrcmp(PrimeFactors(121), [11, 11]), "Prime factors of 121");


}

function Calculate() {
    var val_modulo = Number(document.getElementById("modulo").value);
    var val_factorization = PoweredPrimeFactors(PrimeFactors(val_modulo));
    if (val_factorization.length != 2) {
        alert("Be advised, N is not a product of two primes! RSA keys would be messed up!");
    }

    var keyModulo = GenericEuler(val_modulo);
    var keygroup = MakeMultiplicativeGroup(keyModulo);

    var orders = keygroup.map((v) => {
        return Order(v, keyModulo);
    });

    var keys = [];
    for (var i = 0; i < orders.length && i < keygroup.length; i++) {
        if (orders[i] <= 2)
            continue;
        var enc = keygroup[i];
        var dec = Power(enc, orders[i] - 1, keyModulo);
        if (needTesting) {
            console.assert((enc * dec) % keyModulo == 1, "Encryption and decryption product equals 1");
        }
        var contains = false;
        keys.forEach((v) => {
            if (v[0] == enc || v[0] == dec || v[1] == enc || v[1] == dec)
                contains = true;
        });
        if (!contains) {
            keys.push([enc, dec]);
        }
    }

    var valGroup = MakeMultiplicativeGroup(val_modulo);
    valGroup = valGroup.map((v) => { return [v, Order(v, val_modulo)]; });


    document.getElementById("phi_N").innerHTML = "&#x3d5;(N):&nbsp;" + Euler(val_modulo) + ";";
    document.getElementById("L_N").innerHTML = "L(N):&nbsp;" + keyModulo + ";";
    document.getElementById("phi_L_N").innerHTML = "&#x3d5;(L(N)):&nbsp;" + Euler(keyModulo) + ";";
    var maxorder = -1;
    orders.forEach((v) => {
        if (v > maxorder)
            maxorder = v;
    });
    document.getElementById("L_L_N").innerHTML = "L(L(N)):&nbsp;" + GenericEuler(keyModulo) + ";";

    if (needTesting) {
        console.assert(keygroup.length == Euler(keyModulo), "Keygroup size equals phi(L(N))");
        console.assert(maxorder == GenericEuler(keyModulo), "Maxorder equals L(L(N))");
        orders.forEach((v) => {
            console.assert(maxorder % v == 0, "Maxorder is divisible by order " + v);
        });
    }

    var table = document.getElementById("keyGroup");
    table.innerHTML = "<caption>Multiplicative group modulo L(N) <br>(Group of keys)</caption>\n<tr><th>Element</th><th>Order</th></tr>\n";
    for (var i = 0; i < orders.length && i < keygroup.length; i++) {
        table.innerHTML += "<tr><td>" + keygroup[i] + "</td><td>" + orders[i] + "</td></tr>\n";
    }

    table = document.getElementById("keyPairs");
    table.innerHTML = "<caption>Key pairs for RSA</caption>\n<tr><th>Encryption</th><th>Decription</th></tr>";
    keys.forEach((pair) => {
        table.innerHTML += "<tr><td>" + pair[0] + "</td><td>" + pair[1] + "</td></tr>";
    });

    table = document.getElementById("valGroup");
    table.innerHTML = "<caption>Multiplicative group modulo N <br>(Group of values)</caption><tr><th>Element</th><th>Order</th></tr>"
    valGroup.forEach((pair) => {
        table.innerHTML += "<tr><td>" + pair[0] + "</td><td>" + pair[1] + "</td></tr>";
    });

    if (needTesting) {
        for (var i = 0; i < keys.length; i++) {
            for (var j = 0; j <= 1; j++) {
                for (var k = 0; k < i; k++) {
                    for (var l = 0; l <= 1; l++) {
                        console.assert(keys[i][j] != keys[k][l], "Every key occurs only one time");
                    }
                }
            }

        }

        var fakeOrders = [];
        var fakeKeys = [];
        orders.forEach((o) => { fakeOrders.push(o); });
        keygroup.forEach((k) => { fakeKeys.push(k); });
        var toDelete = [];
        keys.forEach((pair) => {
            toDelete.push(pair[0]);
            toDelete.push(pair[1]);
        });
        while (toDelete.length > 0) {
            var del = toDelete.pop();
            var dinx = -1;
            fakeKeys.forEach((key, inx) => {
                if (key == del) {
                    dinx = inx;
                }
            });
            if (dinx >= 0 && dinx < fakeKeys.length && dinx < fakeOrders.length) {
                fakeKeys = fakeKeys.filter((v, inx) => {
                    return inx != dinx;
                });
                fakeOrders = fakeOrders.filter((v, inx) => {
                    return inx != dinx;
                });
            }
        }
        var scdOrder = true;
        fakeOrders.forEach((v) => {
            if (v > 2) {
                scdOrder = false;
            }
        });
        console.assert(scdOrder, "All non-second-order elements are used for key pairs");
    }
}