import JsPDF from 'jspdf'
import { LazadaOrder } from '../pages/types/LazadaOrderType'
import { PlexFont } from '../assets/Ekkamai'

const numberToThaiBahtText = (inputNumber: number) => {
  const getText = (input: number) => {
    const toNumber = input.toString()
    const numbers = toNumber.split('').reverse()

    const numberText = '/หนึ่ง/สอง/สาม/สี่/ห้า/หก/เจ็ด/แปด/เก้า/สิบ'.split('/')
    const unitText = '/สิบ/ร้อย/พ้น/หมื่น/แสน/ล้าน'.split('/')

    let outputText = ''
    for (let i = 0; i < numbers.length; i += 1) {
      const number = parseInt(numbers[i], 10)
      const text = numberText[number]
      const unit = unitText[i]

      if (i === 1 && number === 2) {
        outputText = `ยี่สิบ${outputText}`
      }

      if (i === 1 && number === 1) {
        outputText = `สิบ${outputText}`
      }

      outputText = text + unit + outputText
    }

    return outputText
  }

  const fullNumber = Math.floor(inputNumber)
  let decimal = inputNumber - fullNumber

  if (decimal === 0) {
    return `${getText(fullNumber)}บาทถ้วน`
  }
  // convert decimal into full number, need only 2 digits
  decimal *= 100
  decimal = Math.round(decimal)

  return `${getText(fullNumber)}บาท${getText(decimal)}สตางค์`
}

const getBase64Svg = (url: string) => {
  return new Promise((resolve) => {
    fetch(url)
      .then((response) => resolve(response.text()))
    //   .then((blob) => {
    //     const reader = new FileReader()
    //     reader.onload = function () {
    //       resolve(this.result)
    //     } // <--- `this.result` contains a base64 data URI
    //     reader.readAsDataURL(blob)
    //   })
  })
}


    
    

const GenStudentBill = async (orders: LazadaOrder[], labels: string[]) => {
  console.log(orders)
  const doc = new JsPDF('p', 'pt', 'a5')
  doc.addFileToVFS('EkkamaiNew-Regular-normal.ttf', PlexFont)
  doc.addFont('EkkamaiNew-Regular-normal.ttf', 'EkkamaiNew-Regular', 'normal')
  doc.setFont('EkkamaiNew-Regular', 'normal')

  for (let z = 0; z < orders.length; z += 1) {
    const order = orders[z].data.data
    const products = order[6].dataSource

    let yTracking = 30
    const svgBase64 = await getBase64Svg(labels[z]);
    console.log(svgBase64);
    // doc.addImage(svgBase64 as string, 'PNG', 20, yTracking, 500, 100)
    doc.addSvgAsImage(svgBase64 as string, 20, yTracking, 500, 100)
    yTracking += 150
    doc.line(25, yTracking, 400, yTracking)
    yTracking += 20

    for (let i = 0; i < products.length; i += 1) {
      const product = products[i]

      const isThai = /([\u0E00-\u0E7F]+)/gmu.test(product.itemName)
      let productName = product.sellerSku
      if (isThai && product.sellerSku) {
        productName = product.itemName
      }
      doc.setFontSize(10)
      doc.text(`${i + 1}`, 30, yTracking)

      doc.addImage(product.itemImgUrl, 'JPEG', 40, yTracking - 15, 26, 26)
      doc.setFontSize(7)
      const splitSellerSku = doc.splitTextToSize(product.sellerSku, 90)
      doc.text(splitSellerSku, 70, yTracking)
      const splitProductName = doc.splitTextToSize(productName, 130)
      doc.text(splitProductName, 160, yTracking)
      doc.text(`${product.totalAmount}`, 340, yTracking)
      doc.line(25, yTracking + 15, 400, yTracking + 10)
      yTracking += 40
    }

    // end tracking page
    doc.addPage()

    //   doc.addImage(LogoCuteCute, 'JPEG', 20, 20, 85, 85);

    doc.setFontSize(12)
    doc.text('CuteCuteShop - ร้านคิวท์คิวท์', 110, 40)
    doc.setFontSize(7)
    doc.text('39 ม.1 ต.ท่าตะโก อ.ท่าตะโก จ.นครสวรรค์ 60160', 110, 55)
    doc.text('เลขประจำตัวผู้เสียภาษี 1609901357645', 110, 65)
    doc.text('โทร 0923241953', 110, 75)

    doc.setFontSize(12)
    doc.text('บิลเงินสด', 305, 30)
    doc.text('CASH SALE', 305, 45)

    doc.setFontSize(7)
    doc.text('เลขที่', 305, 60)
    doc.text('No.', 305, 70)
    doc.setFontSize(6)
    doc.text(order[0].orderNumber, 323, 65)

    doc.setFontSize(7)
    doc.text('วันที่', 305, 85)
    doc.text('Date.', 305, 95)
    doc.rect(300, 50, 90, 50)

    doc.text('นามผู้ซื้อ', 30, 130)
    doc.text("Customer's Name", 30, 140)
    doc.rect(120, 140, 240, 0)

    doc.text('ที่อยู่', 30, 160)
    doc.text('Address', 30, 170)
    doc.rect(120, 170, 240, 0)

    doc.rect(20, 115, 370, 60)

    doc.text('ลำดับที่', 25, 200)
    doc.text('No.', 25, 210)

    doc.text('รหัสสินค้า', 60, 200)
    doc.text('SKU', 60, 210)

    doc.text('ชื่อสินค้า', 130, 200)
    doc.text('Product Name', 130, 210)

    doc.text('จำนวน', 260, 200)
    doc.text('Quantity', 260, 210)

    doc.text('หน่วย', 310, 200)
    doc.text('Rate', 310, 210)

    doc.text('จำนวนเงิน', 340, 200)
    doc.text('Amount', 340, 210)

    doc.rect(20, 185, 370, 30)
    doc.rect(20, 215, 370, 240)
    doc.rect(20, 185, 35, 270)
    doc.rect(55, 185, 65, 270)
    doc.rect(120, 185, 135, 270)
    doc.rect(300, 185, 35, 270)

    // loop products
    let y = 230
    let total = 0
    for (let i = 0; i < products.length; i += 1) {
      const product = products[i]

      const isThai = /([\u0E00-\u0E7F]+)/gmu.test(product.itemName)
      let productName = product.sellerSku
      if (isThai && product.sellerSku) {
        productName = product.itemName
      }

      doc.setFontSize(7)
      doc.text(`${i + 1}`, 30, y)
      const splitSellerSku = doc.splitTextToSize(product.sellerSku, 40)
      doc.text(splitSellerSku, 60, y)
      const splitProductName = doc.splitTextToSize(productName, 110)
      doc.text(splitProductName, 130, y)
      doc.text(`1`, 260, y)
      doc.text(`${product.totalAmount}`, 310, y)
      doc.text(`${product.totalAmount}`, 360, y)
      total += parseFloat(product.totalAmount)
      y += 35
    }

    doc.setFontSize(12)
    doc.text('รวมเงิน', 280, 470)
    doc.setFontSize(8)
    doc.text('SUBTOTAL', 280, 480)
    doc.setFontSize(12)
    doc.text(`${total}`, 362, 475)

    doc.text('ยอดเงินสุทธิ', 270, 500)
    doc.setFontSize(8)
    doc.text('TOTAL', 270, 510)
    doc.setFontSize(12)
    doc.text(`(${numberToThaiBahtText(total)})`, 260, 505, {
      align: 'right',
    })
    doc.text(`${total}`, 362, 505)

    doc.rect(20, 455, 370, 30)
    doc.rect(20, 485, 370, 30)
    doc.rect(335, 455, 55, 60)
    // doc.rect(355, 455, 55, 60);

    doc.text('ผู้รับเงิน', 70, 570)
    doc.setFontSize(8)
    doc.text('Collector', 70, 580)
    doc.rect(40, 558, 100, 0)

    doc.text('ขอขอบคุณที่อุดหนุน', 295, 560, { align: 'center' })
    doc.text('Thank you for your support', 295, 570, { align: 'center' })

    doc.addPage()
  }

  const outputHere = doc.output('datauristring')
  console.log(outputHere)
  return outputHere
}

export default GenStudentBill
