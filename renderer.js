
const escpos = require('escpos');
const moment = require('moment');
const iconv = require('iconv-lite');
var printType = 'usb';
var txtLogs = document.getElementById('txtLogs');
var txtIp = document.getElementById('txtIp');
var boxTxtIp = document.getElementById('boxTxtIp');
var txtPrintType = document.getElementsByName('printType');

document.querySelectorAll("input[name='printType']").forEach((input) => {
	input.addEventListener('change', (value) => {
		printType = value.target.value;
		if (printType == 'network') {
			boxTxtIp.style.display = 'block';
		} else {
			boxTxtIp.style.display = 'none';
		}
		console.log(printType);
	});
});

document.getElementById('txtPrint').addEventListener('click', () => {
	console.log('print test');
	printTest(printType);
	txtLogs.value += `\n${moment().format('HH:mm:ss')} - Print test....`;
});

function printTest(mode = 'usb') {
	let device = null;
	try {
		if (mode === 'usb') {
			device = new escpos.USB();
		} else {
			device = new escpos.Network(txtIp.value);
		}

		const printer = new escpos.Printer(device);
		const hosname = 'EZiosk';
		const hn = '52298168';
		device.open(function () {
			printer
				.model('qrprinter')
				.encode('tis620')
				.align('ct')
				.size(2, 1)
				.text(hosname)
				.size(1, 1);

			printer
				.text('')
				.style('u')
				.text('NUMBER')
				.style('b')
				.text(hn);

			printer
				.text('')
				.style('u')
				.text('ชื่อ-นามสกุล')
				.style('b')
				.text('สาธิต สีถาพล')
				.text('')
				.text('ภาษาไทย');

			if (hn) {
				printer.barcode(hn, 'CODE39', { height: 50, font: 'B' });
			}

			printer.text('')
				.cut()
				.close();
		});
	} catch (error) {
		console.log(error);
	}
}
