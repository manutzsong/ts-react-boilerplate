import JsPDF from 'jspdf';
import { PlexFont } from '../assets/Ekkamai';
import { storage } from '@extend-chrome/storage';
import { LaqoliLocalStorage } from '../pages/types/LaqoliLocalStorage';
import { ShopeeOrderType } from '../pages/types/ShopeeOrderType';
import shopeeAPI from './shopeeAPI';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
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
    shopeeAPI.getShopInfo(),
    shopeeAPI.getAddress(),
    shopeeAPI.getShopLogo(),
  ]);

  const shopInfoRes = promises[0];
  const shopAddress = promises[1];
  const shopLogoURL = promises[2];

  const selectedAddress = shopAddress.data.list.find(
    (z) => z.address_id === shopInfoRes.data.pickup_address_id,
  );

  const shopInfo = {
    name: shopInfoRes.data.name,
    phone: `0${selectedAddress?.phone.substring(2)}`,
    address: `${selectedAddress?.address} ${selectedAddress?.state}`,
    logo: shopLogoURL,
  };

  return shopInfo;
};

const GetShoppeeStudentBill = async (orders: ShopeeOrderType[]) => {
  /* initial call */
  const dataSync = await storage.sync.get();
  const dataLocal = await storage.local.get();
  const shopInfo = await getShopInfo();
  console.log(dataLocal, dataSync, shopInfo);

  const laqoliLocalStorage: LaqoliLocalStorage = dataLocal.laqoliLocalStorage;
  /* initial call */

  console.log(orders);
  const doc = new JsPDF('p', 'pt', 'a5');
  doc.addFileToVFS('Kanit-Regular-normal.ttf', PlexFont);
  doc.addFont('Kanit-Regular-normal.ttf', 'Kanit-Regular-normal', 'normal');
  doc.setFont('Kanit-Regular-normal', 'normal');

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

    const order = orders[z].data;
    const products = order.order_items;

    // end tracking page

    //if bill is true, add bill page
    if (z !== 0) {
      doc.addPage();
    }

    doc.addImage(shopInfo.logo, 'PNG', 20, 20, 85, 85, undefined, 'FAST');

    doc.setFontSize(10);
    doc.text(shopInfo.name, 110, 40);
    doc.setFontSize(7);
    const splitAddress = doc.splitTextToSize(shopInfo.address, 200);
    doc.text(splitAddress, 110, 55);
    doc.text(
      `เลขประจำตัวผู้เสียภาษี ${laqoliLocalStorage.identificationNumber}`,
      110,
      85,
    );
    doc.text(`โทร ${shopInfo.phone}`, 110, 95);

    doc.setFontSize(12);
    doc.text('ใบเสร็จรับเงิน', 305, 30);
    doc.text('RECEIPT', 305, 45);

    doc.setFontSize(9);
    doc.text('เลขที่', 305, 60);
    doc.text('No.', 305, 70);
    doc.setFontSize(6);
    doc.text(order.order_sn, 323, 65);

    doc.setFontSize(9);
    doc.text('วันที่', 305, 85);
    doc.text('Date.', 305, 95);
    doc.rect(300, 50, 90, 50);
    doc.text(dayjs().format("DD/MMM/BBBB"), 330, 90);

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
    for (let i = 0; i < products.length; i += 1) {
      let index = i;
      const product = products[i];
      console.log(index);
      if (product.bundle_deal_model.length > 0) {
        for (let j = 0; j < product.bundle_deal_model.length; j += 1) {
          index = index + 1;
          const bundle = product.item_list[j];
          const matchedModel = product.bundle_deal_model.find(
            (c) => c.model_id === bundle.model_id,
          );
          const matchedModelProductName = product.bundle_deal_product.find(
            (c) => c.model_id === bundle.model_id,
          );

          doc.setFontSize(7);
          doc.text(`${index}`, 30, y);

          const splitSellerSku = doc.splitTextToSize(
            matchedModel?.sku as string,
            40,
          );
          doc.text(splitSellerSku, 60, y);

          const splitProductName = doc.splitTextToSize(
            matchedModelProductName?.name as string,
            110,
          );
          doc.text(splitProductName, 130, y);

          doc.text(`${bundle.amount}`, 260, y);
          doc.text(`${bundle.item_price.toString().replace(/\.00$/,'')}`, 310, y);
          doc.text(`${bundle.amount * parseFloat(bundle.item_price)}`, 360, y);
          total += bundle.amount * parseFloat(bundle.item_price);
          y += 35;
        }
      } else {
        if (i - 1 > 0 && products[i - 1].bundle_deal_product.length > 0) {
          //if previous product is bundle
          index = index + products[i - 1].item_list.length - 1;
        }
        index = index + 1;
        const productName = product.product.name;

        const productQty = product.amount;
        const sumCurrentProducts =
          parseFloat(product.product.price_before_discount) * productQty;

        doc.setFontSize(7);
        doc.text(`${index}`, 30, y);
        // doc.setFontSize(6);
        const splitSellerSku = doc.splitTextToSize(product.item_model.sku, 40);
        doc.text(splitSellerSku, 60, y);
        const splitProductName = doc.splitTextToSize(productName, 110);
        doc.text(splitProductName, 130, y);
        // doc.setFontSize(6);
        doc.text(product.amount?.toString() ?? '1', 260, y);
        doc.text(product.item_model.price_before_discount.replace(/\.00$/,''), 310, y);
        doc.text(sumCurrentProducts.toString(), 360, y);
        total += sumCurrentProducts;
        y += 35;
      }
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

  const pageCount = doc.getNumberOfPages();
  doc.deletePage(pageCount);
  const outputHere = doc.output('datauristring');
  window.open(doc.output('bloburl'), '_blank');
  console.log(outputHere);
  return outputHere;
};

export default GetShoppeeStudentBill;
