document.getElementById('method').addEventListener('change', function() {
    const bisectionInputs = document.getElementById('bisection-inputs');
    const newtonInputs = document.getElementById('newton-inputs');
    if (this.value === 'bisection') {
        bisectionInputs.style.display = 'block';
        newtonInputs.style.display = 'none';
    } else {
        bisectionInputs.style.display = 'none';
        newtonInputs.style.display = 'block';
    }
});

function calculateRoot() {
    const equation = document.getElementById('equation').value;
    const method = document.getElementById('method').value;
    const tolerance = parseFloat(document.getElementById('tolerance').value);
    const maxIterations = parseInt(document.getElementById('max-iterations').value);

    if (!equation) {
        alert('Please enter an equation.');
        return;
    }

    const node = math.parse(equation);
    const f = x => node.evaluate({ x: x });

    const tableHead = document.querySelector('#results-table thead tr');
    const tableBody = document.querySelector('#results-table tbody');
    const rootOutput = document.getElementById('root-output');

    tableHead.innerHTML = '';
    tableBody.innerHTML = '';
    rootOutput.innerHTML = '';

    try {
        if (method === 'bisection') {
            const a = parseFloat(document.getElementById('a').value);
            const b = parseFloat(document.getElementById('b').value);
            tableHead.innerHTML = '<th>Iteration</th><th>a</th><th>b</th><th>c</th><th>f(c)</th>';
            bisectionMethod(f, a, b, tolerance, maxIterations);
        } else if (method === 'newton') {
            const x0 = parseFloat(document.getElementById('x0').value);
            tableHead.innerHTML = '<th>Iteration</th><th>x_n</th><th>f(x_n)</th><th>f\'(x_n)</th><th>x_{n+1}</th>';
            newtonMethod(f, x0, tolerance, maxIterations);
        }
    } catch (error) {
        rootOutput.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}

function bisectionMethod(f, a, b, tol, maxIter) {
    const tableBody = document.querySelector('#results-table tbody');
    const rootOutput = document.getElementById('root-output');

    if (f(a) * f(b) >= 0) {
        rootOutput.innerHTML = '<p style="color: red;">Bisection method requires f(a) and f(b) to have opposite signs.</p>';
        return;
    }

    let iter = 0;
    let c;

    while (iter < maxIter) {
        c = (a + b) / 2;
        const fc = f(c);

        const row = tableBody.insertRow();
        row.innerHTML = `<td>${iter + 1}</td><td>${a.toFixed(6)}</td><td>${b.toFixed(6)}</td><td>${c.toFixed(6)}</td><td>${fc.toFixed(6)}</td>`;

        if (Math.abs(fc) < tol || (b - a) / 2 < tol) {
            rootOutput.innerHTML = `Approximate root is: ${c.toFixed(6)}`;
            return;
        }

        if (f(a) * fc < 0) {
            b = c;
        } else {
            a = c;
        }
        iter++;
    }
    rootOutput.innerHTML = '<p style="color: orange;">Method did not converge within the maximum iterations.</p>';
}

function newtonMethod(f, x0, tol, maxIter) {
    const tableBody = document.querySelector('#results-table tbody');
    const rootOutput = document.getElementById('root-output');
    
    const equation = document.getElementById('equation').value;
    const dfNode = math.derivative(equation, 'x');
    const df = x => dfNode.evaluate({ x: x });

    let xn = x0;
    let iter = 0;

    while (iter < maxIter) {
        const fxn = f(xn);
        const dfxn = df(xn);

        if (Math.abs(dfxn) < 1e-12) {
            rootOutput.innerHTML = '<p style="color: red;">Derivative is zero. Newton\'s method fails.</p>';
            return;
        }

        const xn1 = xn - fxn / dfxn;

        const row = tableBody.insertRow();
        row.innerHTML = `<td>${iter + 1}</td><td>${xn.toFixed(6)}</td><td>${fxn.toFixed(6)}</td><td>${dfxn.toFixed(6)}</td><td>${xn1.toFixed(6)}</td>`;

        if (Math.abs(xn1 - xn) < tol) {
            rootOutput.innerHTML = `Approximate root is: ${xn1.toFixed(6)}`;
            return;
        }

        xn = xn1;
        iter++;
    }
    rootOutput.innerHTML = '<p style="color: orange;">Method did not converge within the maximum iterations.</p>';
}