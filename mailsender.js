function welcome(mail, recipient){
    require('fs').readFile('welcome-mail.html', 'utf8', function(err, contents) {

        var mailOptions = {
            from: 'arveto.softwares@gmail.com',
            to: recipient,
            subject: 'ESSAIM - Validation de votre inscription',
            html: contents,
            text: "Bonjour,\
            Merci de votre inscription! Grâce à votre compte, vos paiements à la cafétéria seront facilités.\
            Votre solde est pour l'instant nul, mais vous pouvez le recharger en vous adressant à un cafetier.\
            Pour toute question ou problème, vous pouvez vous adresser à un cafetier ou membre du BDE.\
            Merci beaucoup!"
        };

        mail.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });
}

function lowSold(mail, recipient){
    require('fs').readFile('low-sold-mail.html', 'utf8', function(err, contents) {

        var mailOptions = {
            from: 'arveto.softwares@gmail.com',
            to: recipient,
            subject: 'ESSAIM - Solde faible',
            html: contents,
            text: "Bonjour,\
            Suite à votre dernière commande, votre solde est passé sous un seuil critique. Pensez à le recharger la prochaine\
            fois que vous souhaitez passer une commande!Le paiement pour recharger votre solde peut être efectué à la cafétéria\
            en liquide ou via l'application LyfPay.\
            Merci beaucoup!"
        };

        mail.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });
}

module.exports = {welcome, lowSold};
