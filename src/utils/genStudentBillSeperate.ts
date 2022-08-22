import JsPDF from 'jspdf';
import { LazadaOrder, LazadaOrderItem } from '../pages/types/LazadaOrderType';
import { PlexFont } from '../assets/Ekkamai';
import fetchSVG from './fetchSVG';
import { storage } from '@extend-chrome/storage';
import { LaqoliLocalStorage } from '../pages/types/LaqoliLocalStorage';
import { LaqoliSyncSettings } from '../pages/types/LaqoliSyncSettings';
import lazadaAPI from './lazadaAPI';
import { CordiaNewBold } from '../assets/Cordia-New-Bold-bold';
import ConstantList from '../pages/options/constant';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import dayjs from 'dayjs';
import thLocale from 'dayjs/locale/th';
dayjs.locale(thLocale);
dayjs.extend(buddhistEra)

const numberToThaiBahtText = (inputNumber: number) => {
  const getText = (input: number) => {
    const toNumber = input.toString();
    const numbers = toNumber.split('').reverse();

    const numberText = '/หนึ่ง/สอง/สาม/สี่/ห้า/หก/เจ็ด/แปด/เก้า/สิบ'.split('/');
    const unitText = '/สิบ/ร้อย/พ้น/หมื่น/แสน/ล้าน'.split('/');

    let outputText = '';
    for (let i = 0; i < numbers.length; i += 1) {
      const number = parseInt(numbers[i], 10);
      const text = numberText[number];
      const unit = unitText[i];

      if (i === 1 && number === 2) {
        outputText = `ยี่สิบ${outputText}`;
      }

      if (i === 1 && number === 1) {
        outputText = `สิบ${outputText}`;
      }

      outputText = text + unit + outputText;
    }

    return outputText;
  };

  const fullNumber = Math.floor(inputNumber);
  let decimal = inputNumber - fullNumber;

  if (decimal === 0) {
    return `${getText(fullNumber)}บาทถ้วน`;
  }
  // convert decimal into full number, need only 2 digits
  decimal *= 100;
  decimal = Math.round(decimal);

  return `${getText(fullNumber)}บาท${getText(decimal)}สตางค์`;
};

const getImageDimension = (
  imgBase64: string,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const im = new Image();
    im.src = imgBase64;
    im.onload = () =>
      resolve({
        width: 200,
        height: (im.height / im.width) * 200,
      });
  });
};

const getShopInfo = async (): Promise<{
  name: string;
  address: string;
  phone: string;
  logo: string;
}> => {
  const promises = await Promise.all([
    lazadaAPI.getShopInfo(),
    lazadaAPI.getAddress(),
    lazadaAPI.getShopPhone(),
  ]);

  const shopInfoRes = promises[0];
  const shopAddress = promises[1];
  const shopPhone = promises[2];

  const shopInfo = {
    name: ConstantList.partnershipName,
    phone: ConstantList.partnershipPhone,
    address: ConstantList.partnershipAddress,
    logo: ConstantList.partnershipLogo,
  };

  return shopInfo;
};

const GenStudentBillSeperate = async (
  orders: LazadaOrder[],
  labels: string[],
  bill: boolean,
) => {
  /* initial call */
  const dataSync = await storage.sync.get();
  const dataLocal = await storage.local.get();
  const shopInfo = await getShopInfo();
  console.log(dataLocal, dataSync, shopInfo);

  const laqoliLocalStorage: LaqoliLocalStorage = dataLocal.laqoliLocalStorage;
  const laqoliSyncSettings: LaqoliSyncSettings = dataSync.laqoliSyncSettings;
  /* initial call */

  console.log(orders);
  const doc = new JsPDF('p', 'pt', [288, 288]);
  doc.addFileToVFS('CordiaNewBold.ttf', CordiaNewBold);
  doc.addFont('CordiaNewBold.ttf', 'Cordia New Bold', 'bold');
  doc.setFont('Cordia New Bold', 'bold');

  const docStudentBill = new JsPDF('p', 'pt', 'a5');
  docStudentBill.addFileToVFS('Kanit-Regular-normal.ttf', PlexFont);
  docStudentBill.addFont(
    'Kanit-Regular-normal.ttf',
    'Kanit-Regular-normal',
    'normal',
  );
  docStudentBill.setFont('Kanit-Regular-normal', 'normal');

  for (let z = 0; z < orders.length; z += 1) {
    // Get the snackbar DIV
    const snackbarDiv = document.getElementById('snackbar');
    if (snackbarDiv) {
      // Add the "show" class to DIV
      snackbarDiv.className = 'show';
      snackbarDiv.textContent = `Printing ${z + 1}/${orders.length}`;

      // After 3 seconds, remove the show class from DIV
      setTimeout(function () {
        console.log('SNACKBAR ');
        if (snackbarDiv) {
          snackbarDiv.className = snackbarDiv.className.replace('show', '');
        }
      }, 1000);
    }

    const order = orders[z].data.data;
    let products = order[6].dataSource;
    products = products.filter((product) => product.status !== 'canceled');

    let yTracking = 10;
    const pngBase64 = await fetchSVG(labels[z]);
    doc.addImage(pngBase64, 'PNG', 15, 15, 180, 252, undefined, 'FAST');

    if (
      laqoliLocalStorage &&
      laqoliLocalStorage.logoSmall &&
      laqoliSyncSettings.logoEnabled
    ) {
      if (laqoliLocalStorage.logoSmall) {
        const { width, height } = await getImageDimension(
          laqoliLocalStorage.logoSmall,
        );
        doc.addImage(
          laqoliLocalStorage.logoSmall,
          'PNG',
          210,
          30,
          width / 4,
          height / 4,
          undefined,
          'FAST',
        );
      }
    }

    yTracking += 280;

    if (laqoliSyncSettings && laqoliSyncSettings.orderNumberEnabled) {
      doc.setFontSize(13);
      doc.text(`${order[0].orderNumber}`, 200, yTracking - 50);
    }

    doc.line(25, yTracking, 400, yTracking);

    // reset yTracking for new page
    yTracking = 30;
    // doc add page
    doc.addPage();

    //products groupby same skuId
    const groupUpProducts: LazadaOrderItem[] = products.reduce(
      (acc: LazadaOrderItem[], cur) => {
        const found = acc.find((item) => item.skuId === cur.skuId);
        if (found) {
          if (found.quantity) {
            found.quantity += 1;
            found.sum = found.quantity * parseFloat(found.totalAmount);
          }
        } else {
          cur.quantity = 1;
          acc.push(cur);
        }
        return acc;
      },
      [],
    );

    console.log(groupUpProducts);

    for (let i = 0; i < products.length; i += 1) {
      const product = products[i];

      doc.setFontSize(25);
      doc.text(`${i + 1}`, 30, yTracking);

      doc.addImage(
        product.itemImgUrl,
        'JPEG',
        40,
        yTracking - 17,
        26,
        26,
        undefined,
        'FAST',
      );
      // if (product.sellerSku.length >= 0 && product.sellerSku.length <= 20) {
      //   console.log(product.sellerSku.length);
      //   doc.text(product.sellerSku, 70, yTracking);
      //   doc.line(25, yTracking + 10, 400, yTracking + 10);
      // } else if (
      //   product.sellerSku.length > 20 &&
      //   product.sellerSku.length <= 40
      // ) {
      //   console.log(product.sellerSku.length);
      //   doc.setFontSize(20);
      //   doc.text(product.sellerSku, 70, yTracking);
      //   doc.line(25, yTracking + 10, 400, yTracking + 10);
      // } else {
      doc.setFontSize(20);
      console.log(product.sellerSku.length);
      const splitSellerSKU = doc.splitTextToSize(product.sellerSku, 210);
      doc.text(splitSellerSKU, 70, yTracking - 10);
      doc.line(25, yTracking + 20, 400, yTracking + 20);
      // }

      yTracking += 40;
      if (yTracking > 270) {
        // 550 is the length of A5 in point unit https://www.papersizes.org/a-sizes-all-units.htm
        doc.addPage();
        yTracking = 30;
      }
    }

    // end tracking page
    if (bill) {
      //if bill is true, add bill page

      docStudentBill.addImage(
        ConstantList.partnershipLogo,
        'PNG',
        20,
        20,
        85,
        85,
        undefined,
        'FAST',
      );

      docStudentBill.setFontSize(13);
      docStudentBill.text(shopInfo.name, 110, 40);
      docStudentBill.setFontSize(7);
      docStudentBill.text(shopInfo.address, 110, 55);
      docStudentBill.text(
        `เลขประจำตัวผู้เสียภาษีอากร ${ConstantList.partnershipVatID}`,
        110,
        65,
      );
      docStudentBill.text(`โทร ${shopInfo.phone}`, 110, 75);

      docStudentBill.setFontSize(12);
      docStudentBill.text('บิลเงินสด', 305, 30);
      docStudentBill.text('RECEIPT', 305, 45);

      docStudentBill.setFontSize(9);
      docStudentBill.text('เลขที่', 305, 60);
      docStudentBill.text('No.', 305, 70);
      docStudentBill.setFontSize(6);
      docStudentBill.text(order[0].orderNumber, 323, 65);

      docStudentBill.setFontSize(9);
      docStudentBill.text('วันที่', 305, 85);
      docStudentBill.text('Date.', 305, 95);
      docStudentBill.rect(300, 50, 90, 50);
      doc.text(dayjs().format("DD/MMM/BBBB"), 330, 90);

      docStudentBill.text('นามผู้ซื้อ', 30, 130);
      docStudentBill.text("Customer's Name", 30, 140);
      docStudentBill.rect(120, 140, 240, 0);

      docStudentBill.text('ที่อยู่', 30, 160);
      docStudentBill.text('Address', 30, 170);
      docStudentBill.rect(120, 170, 240, 0);

      docStudentBill.rect(20, 115, 370, 60);

      docStudentBill.text('ลำดับที่', 25, 200);
      docStudentBill.text('No.', 25, 210);

      docStudentBill.text('รหัสสินค้า', 60, 200);
      docStudentBill.text('SKU', 60, 210);

      docStudentBill.text('ชื่อสินค้า', 130, 200);
      docStudentBill.text('Product Name', 130, 210);

      docStudentBill.text('จำนวน', 260, 200);
      docStudentBill.text('Quantity', 260, 210);

      docStudentBill.text('หน่วย', 310, 200);
      docStudentBill.text('Rate', 310, 210);

      docStudentBill.text('จำนวนเงิน', 340, 200);
      docStudentBill.text('Amount', 340, 210);

      docStudentBill.rect(20, 185, 370, 30);
      docStudentBill.rect(20, 215, 370, 240);
      docStudentBill.rect(20, 185, 35, 270);
      docStudentBill.rect(55, 185, 65, 270);
      docStudentBill.rect(120, 185, 135, 270);
      docStudentBill.rect(300, 185, 35, 270);

      // loop products
      let y = 230;
      let total = 0;
      for (let i = 0; i < groupUpProducts.length; i += 1) {
        const product = groupUpProducts[i];

        const productQty = product.quantity ?? 1;
        const sumCurrentProducts = parseFloat(product.totalAmount) * productQty;

        docStudentBill.setFontSize(7);
        docStudentBill.text(`${i + 1}`, 30, y);
        // docTracking.setFontSize(6);
        const splitSellerSku = docStudentBill.splitTextToSize(
          product.sellerSku,
          40,
        );
        docStudentBill.text(splitSellerSku, 60, y);
        const splitProductName = docStudentBill.splitTextToSize(
          `(ชุดนักเรียน) ${product.sellerSku}`,
          110,
        );
        docStudentBill.text(splitProductName, 130, y);
        // docTracking.setFontSize(6);
        docStudentBill.text(product.quantity?.toString() ?? '1', 260, y);
        docStudentBill.text(`${product.totalAmount}`, 310, y);
        docStudentBill.text(sumCurrentProducts.toString(), 360, y);
        total += sumCurrentProducts;
        y += 35;
      }

      docStudentBill.setFontSize(12);
      docStudentBill.text('รวมเงิน', 280, 470);
      docStudentBill.setFontSize(8);
      docStudentBill.text('SUBTOTAL', 280, 480);
      docStudentBill.setFontSize(12);
      docStudentBill.text(`${total}`, 372, 475, { align: 'right' });

      docStudentBill.text('ยอดเงินสุทธิ', 270, 500);
      docStudentBill.setFontSize(8);
      docStudentBill.text('TOTAL', 270, 510);
      docStudentBill.setFontSize(12);
      docStudentBill.text(`(${numberToThaiBahtText(total)})`, 260, 505, {
        align: 'right',
      });
      docStudentBill.text(`${total}`, 372, 505, { align: 'right' });

      docStudentBill.rect(20, 455, 370, 30);
      docStudentBill.rect(20, 485, 370, 30);
      docStudentBill.rect(335, 455, 55, 60);
      // docTracking.rect(355, 455, 55, 60);

      docStudentBill.setFontSize(10);
      docStudentBill.text('ผู้รับเงิน', 70, 570);
      docStudentBill.setFontSize(8);
      docStudentBill.text('Collector', 70, 580);
      docStudentBill.rect(40, 558, 100, 0);

      docStudentBill.text('ขอขอบคุณที่อุดหนุน', 295, 560, { align: 'center' });
      docStudentBill.text('Thank you for your support', 295, 570, {
        align: 'center',
      });
      docStudentBill.addPage();
    }

    doc.addPage();
  }
  const pageCount = doc.getNumberOfPages();
  doc.deletePage(pageCount);
  const outputHere = doc.output('datauristring');
  window.open(doc.output('bloburl'), '_blank');
  console.log(outputHere);

  //   const outputHereStudentBill = docStudentBill.output('datauristring');
  const pageCountStudentBill = docStudentBill.getNumberOfPages();
  docStudentBill.deletePage(pageCountStudentBill);
  window.open(docStudentBill.output('bloburl'), '_blank');
  //   console.log(outputHere);
  return outputHere;
};

export default GenStudentBillSeperate;
