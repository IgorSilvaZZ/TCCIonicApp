<?php

    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Origin, Content-Type, Authorization, Accept, X-Requested-With, x-xsrf-token");
    header("Content-Type: application/json/ charset-utf-8");

    include("config.php");

    $postjson = json_decode(file_get_contents("php://input"),true);

    if($postjson['aski'] == "proses_register"){

        $checkemail = mysqli_fetch_array(mysqli_query($mysqli,"select emailUsuario from tbUsuario where emailUsuario = '$postjson[email]'"));

        if($checkemail['emailUsuario'] == $postjson['email']){
            $result = json_encode(array('sucess'=>false, 'msg'=>'Email já existe'));
        }else{
            
            $datenow = date('Y-m-d');
            $datenowxxx = date('Y-m-d_H_i_s');
            $data = date("Y-m-d",strtotime($postjson['dataNasc']));

           /*  $entry = base64_decode($postjson['images']);
            $img = imagecreatefromstring($entry);

            $diretorio = "images/img_user".$datenowxxx.".jpg";
            imagejpeg($img, $diretorio);
            imagedestroy($img); */

            $diretorio = "images/usuario.png";
            
            $password = $postjson['password'];
            $insert = mysqli_query($mysqli, "insert into tbUsuario set 
            emailUsuario =  '$postjson[email]',
            nomeUsuario =  '$postjson[name]',
            dataNascUsuario = '$data',
            sexoUsuario = '$postjson[sexo]',
            fotoUsuario = '$diretorio',
            senhaUsuario =  '$password'
            ");

            if($insert){
                $result = json_encode(array('sucess'=>true, 'msg'=>'Cadastrado com Sucesso'));
            }else{
                $result = json_encode(array('sucess'=>false, 'msg'=>$mysqli->error));
            }
        }
    
        echo $result;
        
    }

    elseif($postjson['aski'] == "proses_login"){
        $password = $postjson['password'];

        $logindata = mysqli_fetch_array(mysqli_query($mysqli,"select * from tbUsuario where emailUsuario = '$postjson[email]' and senhaUsuario = '$password'"));

        $data = array(
        'codUsuario' => $logindata['idUsuario'],
        'nomeUsuario' =>  $logindata['nomeUsuario'],
        'emailUsuario' =>  $logindata['emailUsuario'],
        'dataNascUsuario' => $logindata['dataNascUsuario'],
        'sexoUsuario' => $logindata['sexoUsuario'],
        'fotoUsuario' => $logindata['fotoUsuario'],
        'senhaUsuario' => $logindata['senhaUsuario']
        );

        if($logindata){
            $result = json_encode(array('sucess'=>true, 'result'=>$data));
        }else{
            $result = json_encode(array('sucess'=>false));
        }
    
        echo $result;
        
    }

    elseif($postjson['aski'] == "load_ongs"){
        $ongs = array();

        $query = mysqli_query($mysqli,"select idOng, nomeOng, descricaoOng, logradouroOng, cidadeOng, bairroOng, numeroOng, cepOng, cnpjOng, fotoOng, emailOng, senhaOng, numeroFoneOng,  tbLoginOng.idLoginOng, tbFoneOng.idFoneOng from tbOng inner join tbFoneOng on tbOng.idFoneOng = tbFoneOng.idFoneOng inner join tbLoginOng on tbOng.idLoginOng = tbLoginOng.idLoginOng"); 

        /* $query = mysqli_query($mysqli,"select * from tbOng"); */
        
        while ($rows = mysqli_fetch_array($query)) {

            $ongs[] = array(
                'idOng' => $rows['idOng'],
                'nomeOng' => $rows['nomeOng'],
                'descricaoOng' => $rows['descricaoOng'],
                'logradouroOng' => $rows['logradouroOng'],
                'cidadeOng' => $rows['cidadeOng'],
                'bairroOng' => $rows['bairroOng'],
                'numeroOng' => $rows['numeroOng'],
                'cepOng' => $rows['cepOng'],
                'cnpjOng' => $rows['cnpjOng'],
                'fotoOng' => $rows['fotoOng'],
                'emailOng' => $rows['emailOng'],
                'senhaOng' => $rows['senhaOng'],
                'numeroFoneOng' => $rows['numeroFoneOng'],
            );
        }

        if($query){
            $result = json_encode(array('sucess'=>true, 'result'=>$ongs));
        }else{
            $result = json_encode(array('sucess'=>false, 'result'=>$mysqli->error));
        }
    
        echo $result;

    }

    elseif($postjson['aski'] == "dados_apenas"){

        $query = mysqli_query($mysqli,"select * from tbUsuario where idUsuario = '$postjson[id]'"); 

        /* $query = mysqli_query($mysqli,"select * from tbOng"); */
        
        while ($rows = mysqli_fetch_array($query)) {

            $data = array(
                'nomeUsuario' =>  $rows['nomeUsuario'],
                'emailUsuario' =>  $rows['emailUsuario'],
                'dataNascUsuario' => $rows['dataNascUsuario'],
                'sexoUsuario' => $rows['sexoUsuario'],
                'fotoUsuario' => $rows['fotoUsuario']
                );
        }

        if($query){
            $result = json_encode(array('sucess'=>true, 'result'=>$data));
        }else{
            $result = json_encode(array('sucess'=>false, 'result'=>$mysqli->error));
        }
    
        echo $result;

    }

    else if($postjson['aski'] == "proses_update"){
            $datenow = date('Y-m-d');
            $datenowxxx = date('Y-m-d_H_i_s');
            $data = date("Y-m-d",strtotime($postjson['dataNasc']));
            $diretorio = "images/img_user".$datenowxxx.".jpg";

            if($postjson['images'] == null){
                
                $logindata = mysqli_fetch_array(mysqli_query($mysqli,"select fotoUsuario from tbUsuario where idUsuario = '$postjson[id]'"));

                $imgAntiga = $logindata['fotoUsuario'];

                $update = mysqli_query($mysqli, "update tbUsuario set 
                emailUsuario =  '$postjson[email]',
                nomeUsuario =  '$postjson[name]',
                dataNascUsuario = '$data',
                sexoUsuario = '$postjson[sexo]',
                fotoUsuario = '$imgAntiga' where idUsuario = '$postjson[id]'");

                if($update){
                    $result = json_encode(array('sucess'=>true, 'msg'=>'Atualizado com Sucesso'));
                }else{
                    $result = json_encode(array('sucess'=>false, 'msg'=>$mysqli->error));
                }

            }else{
                $entry = base64_decode($postjson['images']);
                $img = imagecreatefromstring($entry);
                imagejpeg($img, $diretorio);
                imagedestroy($img);

                /*  $diretorio = "images/usuario.png"; */
                    
                /* $password = md5($postjson['password']); */
                $update = mysqli_query($mysqli, "update tbUsuario set 
                emailUsuario =  '$postjson[email]',
                nomeUsuario =  '$postjson[name]',
                dataNascUsuario = '$data',
                sexoUsuario = '$postjson[sexo]',
                fotoUsuario = '$diretorio' where idUsuario = '$postjson[id]'");

                if($update){
                    $result = json_encode(array('sucess'=>true, 'msg'=>'Atualizado com Sucesso'));
                }else{
                    $result = json_encode(array('sucess'=>false, 'msg'=>$mysqli->error));
                }

            }

        echo $result;
    }

    elseif($postjson['aski'] == "listar_user"){

        $password = $postjson['password'];
        $query = mysqli_query($mysqli,"select * from tbUsuario where emailUsuario = '$postjson[email]' and senhaUsuario = '$password'"); 
        
        while ($rows = mysqli_fetch_array($query)) {

            $data = array(
                'nomeUsuario' =>  $rows['nomeUsuario'],
                'emailUsuario' =>  $rows['emailUsuario'],
                'dataNascUsuario' => $rows['dataNascUsuario'],
                'sexoUsuario' => $rows['sexoUsuario'],
                'fotoUsuario' => $rows['fotoUsuario']
                );
        }

        if($query){
            $result = json_encode(array('sucess'=>true, 'result'=>$data));
        }else{
            $result = json_encode(array('sucess'=>false, 'result'=>$mysqli->error));
        }
    
        echo $result;

    }

    elseif($postjson['aski'] == "proses_addfavorito"){

        $check = mysqli_fetch_array(mysqli_query($mysqli,"select idUsuario from tbFavoritos where idOng = '$postjson[ong]'"));

       
        if($check['idUsuario'] == $postjson['ong']){

            $query = mysqli_query($mysqli, "delete from tbFavoritos where idOng = '$postjson[ong]' and idUsuario =  '$postjson[usuario]'
            ");

             if($query){
                $result = json_encode(array('sucess'=>true, 'msg'=>'Deletado com Sucesso'));
            }else{
                $result = json_encode(array('sucess'=>false, 'msg'=>$mysqli->error));
            }
            
            echo $result;

        }else{
            $query = mysqli_query($mysqli, "insert into tbFavoritos set 
                idOng =  '$postjson[ong]',
                idUsuario =  '$postjson[usuario]'
            ");

            if($query){
                $result = json_encode(array('sucess'=>true, 'msg'=>'Adicionado com Sucesso'));
            }else{
                $result = json_encode(array('sucess'=>false, 'msg'=>$mysqli->error));
            }
        
            echo $result;
        }

    }
   

?>
