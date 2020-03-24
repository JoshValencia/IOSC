var timeOut = $('#timeout')
var btnArea = $('#buttons_area');
var timeIn = $('#timein');
var rbutton = $('.r-button');
var report = $('#report')
var addreport = $('#addreport')
var buttons = document.querySelector('#buttons_area button');
var adminModify = $('.admin-modify');
var adminEdit = $('.admin-edit');
var adminCancel = $('.admin-cancel');
var adminCodeCheck = $('#adminCodeCheck');
var Tbody = $('#t-body');
var trTbody = $('#t-body tr');
var inputTable = $('.input');
var tAdd = $('#t-add');
var tRemove = $('#t-remove');
var pAdd = $('#product-add');

$(document).ready(function(){
    rbutton.hide();
    report.hide();
    adminEdit.hide();
    $('#attendancePhoto').hide();
    $(window).scroll(function(){
        if($(window).scrollTop()>480){
            $('#nav').addClass('scrollColor');
        }else{
            $('#nav').removeClass('scrollColor');
        }
    });
    inputTable.hide();

    



    // $("#nav").on('click', function(event) {

    //     // Make sure this.hash has a value before overriding default behavior
    //     if (this.hash !== "") {
    //       // Prevent default anchor click behavior
    //       event.preventDefault();
    
    //       // Store hash
    //       var hash = this.hash;
    
    //       // Using jQuery's animate() method to add smooth page scroll
    //       // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
    //       $('html, body').animate({
    //         scrollTop: $(hash).offset().top
    //       }, 800, function(){
       
    //         // Add hash (#) to URL when done scrolling (default click behavior)
    //         window.location.hash = hash;
    //       });
    //     } // End if
    //   });

});


timeIn.click(function() {
    $('#attendancePhoto').click();
    $('#attendancePhoto').change(function(e){
        if($('#attendancePhoto')[0].value != ""){
            timeIn.hide();
            rbutton.show();
            if('geolocation' in navigator){
                function geo_error() {
                    alert("Sorry, no position available.");
                    }
        
                var geo_options = {
                    enableHighAccuracy: true, 
                    maximumAge        : 30000, 
                    timeout           : 27000
                };
                navigator.geolocation.getCurrentPosition(async position =>{
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    const file = e.target.files[0];
                    const data = {lat, lon, file};
                    const formData = new FormData();
                      
                    for(const name in data) {
                        formData.append(name, data[name]);
                    }
                        
                    var options = {
                        method: 'POST',
                        body: formData
                     }

                    await fetch('/employee/timein', options);
                      
                },geo_error,geo_options);
            } else {
                console.log('geolocation not available');
            }
        }
    })
});

timeOut.click(function() {
    rbutton.hide();
    timeIn.show();
    report.hide();
})

addreport.click(function(){
    report.show();
})


pAdd.click(async function(){
    var prodSku = $('#new-prod-sku').val();
    var prodName = $('#new-prod-name').val();
    if(prodSku != "" && prodName != ""){
        const data = {prodSku,prodName};
        var options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
    
        let response = await fetch('/admin/products/add', options);
        if(response.status == 200){
            $('#new-prod-sku').val('');
            $('#new-prod-name').val('');
            $('#new-prod-sku').focus();
        }
    }
});

tAdd.click(function(){
    Tbody.prepend(`
        <tr id="tr-new-input">
            <td class="newInput"><input type="text" placeholder="Location" class="form-control" id="new-location"></td>
            <td class="newInput">
                <div id="new-sku-field">
                <div class="newSku">
                    <div class="form-group">
                            <div class="input-group mb-2 mr-sm-2">
                            <div class="input-group-prepend">
                                <div class="input-group-text">+</div>
                            </div>
                            <input type="text" placeholder="SKU NUMBER" class="new-sku">
                            </div>
                    </div>
                </div>
                </div>
                <button class="btn btn-success btn-sm" type="button" id="addSku">Add New</button>
                <button class="btn btn-danger btn-sm" type="button" id="removeSku">Remove</button>
            </td>
            <td class="newInput">
                <button class="btn btn-primary btn-sm" id="confirm" >Confirm</button>
                <button class="btn btn-warning btn-sm" id="cancel" >Cancel</button>
            </td>
        </tr>
        `);
    $('#new-location').focus();

    $('#addSku').click(function(){
        $('#new-sku-field').append(`
        <div class="newSku">
                <div class="form-group" class="new-field-sku">
                        <div class="input-group mb-2 mr-sm-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text">+</div>
                        </div>
                        <input type="text" placeholder="SKU NUMBER" class="new-sku" list="dataList">
                        </div>
                </div>
        </div>
         `);
        $('.new-sku').focus();
    });

    $('#removeSku').click(function(){
        $('.newSku').last().remove();
    });

    // $('.new-sku').click(function(){
    //     $('.new-sku').keyup(function(){

    //     })
    // });
    

    $('.newInput #confirm').click(async function(){
        if($('.new-sku').val()!=""&&$('#new-location').val()!=""){
            var allSku = []
            var newSku = $('.new-sku');
            for(let i = 0;i<newSku.length;i++){
                var value = newSku[i].value;
                allSku.push({number : value});
            }
            var location = $('#new-location').val();
            const data = {location,allSku};
            var options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }

            let response = await fetch('/admin/record/add', options);
            // console.log("======BEFORE=====")
            // console.log("-------ALL SKU-----")
            // console.log(allSku)
            // console.log("------NEW SKU------")
            // console.log(newSku)
            // console.log("====================")
            allSku.length = 0;
            newSku = '';
            // console.log("========CLEARED =========")
            // console.log('------ALL SKU------')
            // console.log(allSku);
            // console.log('------NEW SKU-----')
            // console.log(newSku);
            // console.log("================");
                
            let commit = await response.json();
            // console.log("=========CALLBACK RESPONSE=======");
            // console.log(commit)
            // console.log(commit.location);
            // console.log(commit.sku);
            // console.log("=================================");
            var skuArray = commit.sku;
            var skuOptions;
            skuArray.forEach(sku=>{
                skuOptions += '<option>'+ sku.number +'-'+sku.name+'</option>';
            });
            var skuHTML = `${skuOptions}`;
            Tbody.prepend(`
                <tr>
                    <td class="t-show show-location">${commit.location}</td>
                    <td class="input"><input type="text" placeholder="Location" class="form-control"></td>
                    <td class="t-show">
                        <select class="form-control border border-dark">
                            ${skuHTML}
                        </select>
                    </td>
                    <td class="input">
                        <input type="text" class="form-control">
                        <input type="text" class="form-control">
                        <input type="text" class="form-control">
                        <input type="text" class="form-control">
                        <button class="btn btn-success btn-sm" type="button">Add New</button>
                        <button class="btn btn-danger btn-sm" type="button">Remove</button>
                    </td>
                    <td>
                        <button class="btn btn-danger admin-modify btn-sm">Modify</button>
                        <button class="admin-edit admin-cancel btn btn-primary btn-sm">Confirm</button>
                        <button class="admin-edit admin-cancel btn btn-warning btn-sm">Cancel</button>
                    </td>
                </tr>
                `);
            $('#tr-new-input').remove();
        } 
    });

    $('.newInput #cancel').click(function(){
        $('#tr-new-input').remove();
    });
});

$('#t-remove').click(function(){
    $('#t-head tr').prepend(`
        <th scope="col" id="th-checkbox"><input type="checkbox" id="selectAllBox"> Select All</th>
    `);
    $('#t-body tr').prepend(`
        <td class="td-checkbox"><input type="checkbox" class="selectBox"></td>
    `);
    $('#checkbox-confirm').show();
    $('#checkbox-cancel').show();
    $('#t-remove').hide();

    $('#checkbox-cancel').click(function(){
        $('#checkbox-confirm').hide();
        $('#checkbox-cancel').hide();
        $('#t-remove').show();
        $('#th-checkbox').remove();
        $('.td-checkbox').remove();
    });

    $('#selectAllBox').click(function(){
        if ($('#selectAllBox').is(':checked')) {
            $('.selectBox').prop("checked", true);
        }   
        else {
            $('.selectBox').prop("checked", false);
        }
    });

    $('#checkbox-confirm').click(async function(){
        if(confirm("Are you sure?")){
            let outletArr = [];
            let selectBoxes = $('.selectBox');
            selectBoxes.filter(':checked').each(function(){
                outletArr.push({location: $(this).parents('tr').children('.show-location').text()});
            });
            const data = {outletArr};
            var options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }

            let response = await fetch('/admin/record/delete', options);
            if(response.status === 200){
                $('#checkbox-confirm').hide();
                $('#checkbox-cancel').hide();
                $('#t-remove').show();
                $('#th-checkbox').remove();
                $('.td-checkbox').remove();
                location.reload();
            }
        }else{
            location.reload();
            $('.selectBox').prop("checked", false);
        }
    });
}); 


adminModify.click(function(){
    $(this).siblings().show();
    $(this).parent().siblings('.t-show').hide();
    $(this).parent().siblings('.input').show();
    $(this).hide();
    $('.sku-add').click(function(){
        $('.new-sku-container').append(`
            <input type="text" class="form-control show-sku" list="dataList">
        `);
    });
    $('.sku-remove').click(function(){
        $('.new-sku-container input').last().remove();
    });
    $('.sku-confirm').click(async function(){
        var location = $('.sku-location').val();
        var sku = $('.show-sku');
        var skuArr  = []
        sku.each(function(){
            skuArr.push({number : $(this).val()});
        });
        var id = $(this).parent().siblings('.outletID').val();
        const data = {location,skuArr};
        var options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }

        let response = await fetch('/admin/record/update/'+ id, options);
        if(response.status === 200){
            skuArr.length = 0;
            sku = '';
            $(this).hide();
            $(this).siblings('.admin-edit').hide();
            $(this).parent().siblings('.t-show').show();
            $(this).parent().siblings('.input').hide();
            $(this).siblings('.admin-modify').show();
            window.location.reload();
        }
    });
})

adminCancel.click(function(){
    $(this).hide();
    $(this).siblings('.admin-edit').hide();
    $(this).parent().siblings('.t-show').show();
    $(this).parent().siblings('.input').hide();
    $(this).siblings('.admin-modify').show();
    location.reload();
})

$('#work').change(function(){
    if($('#work')[0].value === "Admin"){
        adminCodeCheck.show();
    }else{
        adminCodeCheck.hide();
    }
})





