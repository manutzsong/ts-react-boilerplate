import JsPDF from 'jspdf';
import { LazadaOrder, LazadaOrderItem } from '../pages/types/LazadaOrderType';
import { PlexFont } from '../assets/Ekkamai';
import fetchSVG from './fetchSVG';
import { storage } from '@extend-chrome/storage';
import { LaqoliLocalStorage } from '../pages/types/LaqoliLocalStorage';
import { LaqoliSyncSettings } from '../pages/types/LaqoliSyncSettings';
import lazadaAPI from './lazadaAPI';

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
  ]);

  const shopInfoRes = promises[0];
  const shopAddress = promises[1];

  const shopInfo = {
    name: shopInfoRes.data.data.storeName,
    phone: `0${shopInfoRes.data.data.phone}`,
    address: shopAddress.data.data.fields[8].value,
    logo: shopInfoRes.data.data.shopLogo,
  };

  return shopInfo;
};

const GenStudentBill = async (
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
  const doc = new JsPDF('p', 'pt', 'a5');
  doc.addFileToVFS('Kanit-Regular-normal.ttf', PlexFont);
  doc.addFont('Kanit-Regular-normal.ttf', 'Kanit-Regular-normal', 'normal');
  doc.setFont('Kanit-Regular-normal', 'normal');

  for (let z = 0; z < orders.length; z += 1) {
    const order = orders[z].data.data;
    const products = order[6].dataSource;

    let yTracking = 30;
    const pngBase64 = await fetchSVG(labels[z]);
    doc.addImage(pngBase64, 'PNG', 30, 30, 180, 252, undefined, 'FAST');

    if (laqoliLocalStorage && laqoliLocalStorage.logo && laqoliSyncSettings.logoEnabled) {
      if (laqoliLocalStorage.logo) {
        const { width, height } = await getImageDimension(
          laqoliLocalStorage.logo,
        );
        doc.addImage(
          laqoliLocalStorage.logo,
          'PNG',
          240,
          30,
          width / 1.5,
          height / 1.5,
          undefined,
          'FAST',
        );
      }
    }

    yTracking += 280;

    if (laqoliSyncSettings && laqoliSyncSettings.orderNumberEnabled) {
      doc.setFontSize(10);
      doc.text(`เลขที่ออเดอร์: ${order[0].orderNumber}`, 240, yTracking - 50);
    }

    doc.line(25, yTracking, 400, yTracking);
    yTracking += 20;

    // const testProducts = []
    // for (let i = 0; i < 30; i += 1) {
    //   testProducts.push(products[0])
    // }

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

      doc.setFontSize(10);
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
      doc.setFontSize(12);
      doc.text(product.sellerSku, 70, yTracking);
      doc.text(`${product.totalAmount}`, 340, yTracking);
      doc.line(25, yTracking + 10, 400, yTracking + 10);
      yTracking += 40;
      if (yTracking > 550) {
        // 550 is the length of A5 in point unit https://www.papersizes.org/a-sizes-all-units.htm
        doc.addPage();
        yTracking = 30;
      }
    }

    // end tracking page
    if (bill) { //if bill is true, add bill page
      doc.addPage();

      doc.addImage(shopInfo.logo, 'PNG', 20, 20, 85, 85, undefined, 'FAST');

      doc.setFontSize(13);
      doc.text(shopInfo.name, 110, 40);
      doc.setFontSize(7);
      doc.text(shopInfo.address, 110, 55);
      doc.text(
        `เลขประจำตัวผู้เสียภาษี ${laqoliLocalStorage.identificationNumber}`,
        110,
        65,
      );
      doc.text(`โทร ${shopInfo.phone}`, 110, 75);

      doc.setFontSize(12);
      doc.text('บิลเงินสด', 305, 30);
      doc.text('CASH SALE', 305, 45);

      doc.setFontSize(9);
      doc.text('เลขที่', 305, 60);
      doc.text('No.', 305, 70);
      doc.setFontSize(6);
      doc.text(order[0].orderNumber, 323, 65);

      doc.setFontSize(9);
      doc.text('วันที่', 305, 85);
      doc.text('Date.', 305, 95);
      doc.rect(300, 50, 90, 50);

      doc.text('นามผู้ซื้อ', 30, 130);
      doc.text("Customer's Name", 30, 140);
      doc.rect(120, 140, 240, 0);

      doc.text('ที่อยู่', 30, 160);
      doc.text('Address', 30, 170);
      doc.rect(120, 170, 240, 0);

      doc.rect(20, 115, 370, 60);

      doc.text('ลำดับที่', 25, 200);
      doc.text('No.', 25, 210);

      doc.text('รหัสสินค้า', 60, 200);
      doc.text('SKU', 60, 210);

      doc.text('ชื่อสินค้า', 130, 200);
      doc.text('Product Name', 130, 210);

      doc.text('จำนวน', 260, 200);
      doc.text('Quantity', 260, 210);

      doc.text('หน่วย', 310, 200);
      doc.text('Rate', 310, 210);

      doc.text('จำนวนเงิน', 340, 200);
      doc.text('Amount', 340, 210);

      doc.rect(20, 185, 370, 30);
      doc.rect(20, 215, 370, 240);
      doc.rect(20, 185, 35, 270);
      doc.rect(55, 185, 65, 270);
      doc.rect(120, 185, 135, 270);
      doc.rect(300, 185, 35, 270);

      // loop products
      let y = 230;
      let total = 0;
      for (let i = 0; i < groupUpProducts.length; i += 1) {
        const product = groupUpProducts[i];

        const isThai = /([\u0E00-\u0E7F]+)/gmu.test(product.itemName);
        let productName = product.sellerSku;
        if (isThai && product.sellerSku) {
          productName = product.itemName;
        }
        const productQty = product.quantity ?? 1;
        const sumCurrentProducts = parseFloat(product.totalAmount) * productQty;

        doc.setFontSize(7);
        doc.text(`${i + 1}`, 30, y);
        // doc.setFontSize(6);
        const splitSellerSku = doc.splitTextToSize(product.sellerSku, 40);
        doc.text(splitSellerSku, 60, y);
        const splitProductName = doc.splitTextToSize(productName, 110);
        doc.text(splitProductName, 130, y);
        // doc.setFontSize(6);
        doc.text(product.quantity?.toString() ?? '1', 260, y);
        doc.text(`${product.totalAmount}`, 310, y);
        doc.text(sumCurrentProducts.toString(), 360, y);
        total += sumCurrentProducts;
        y += 35;
      }

      doc.setFontSize(12);
      doc.text('รวมเงิน', 280, 470);
      doc.setFontSize(8);
      doc.text('SUBTOTAL', 280, 480);
      doc.setFontSize(12);
      doc.text(`${total}`, 372, 475, { align: 'right' });

      doc.text('ยอดเงินสุทธิ', 270, 500);
      doc.setFontSize(8);
      doc.text('TOTAL', 270, 510);
      doc.setFontSize(12);
      doc.text(`(${numberToThaiBahtText(total)})`, 260, 505, {
        align: 'right',
      });
      doc.text(`${total}`, 372, 505, { align: 'right' });

      doc.rect(20, 455, 370, 30);
      doc.rect(20, 485, 370, 30);
      doc.rect(335, 455, 55, 60);
      // doc.rect(355, 455, 55, 60);

      doc.setFontSize(10);
      doc.text('ผู้รับเงิน', 70, 570);
      doc.setFontSize(8);
      doc.text('Collector', 70, 580);
      doc.rect(40, 558, 100, 0);

      doc.text('ขอขอบคุณที่อุดหนุน', 295, 560, { align: 'center' });
      doc.text('Thank you for your support', 295, 570, { align: 'center' });
    }

    doc.addPage();
  }
  const pageCount = doc.getNumberOfPages();
  doc.deletePage(pageCount);
  const outputHere = doc.output('datauristring');
  window.open(doc.output('bloburl'), '_blank');
  console.log(outputHere);
  return outputHere;
};

export default GenStudentBill;
