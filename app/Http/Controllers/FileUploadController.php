<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Files;
use Illuminate\Support\Facades\File;


class FileUploadController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {



        $fields = $request->validate([
            'file' => 'required|mimes:doc,docx,pdf,txt,csv,png,jpeg,gif,jpg',
        ]);


        if ($file = $request->file('file')) {



            $file = $this->uploadFile($file);


            Files::create([
                'path'=> $file['path'],
                'name'=>$file['name'],
            ]);

            return response()->json([
                "success" => true,
                "message" => "File successfully uploaded",
                "file" => [
                    'path'=> $file['path'],
                    'name'=>$file['name']
                ]
            ]);

        }

        return ['status'=>'error','message'=>'choose a file'];
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $fields = $request->validate([
            'file' => 'required|mimes:doc,docx,pdf,txt,csv,png,jpeg,gif,jpg',
        ]);

        if ($file = $request->file('file')) {
            //remove previous file if  found
            if(strpos($request->previousFilePath,'default_avatar') == false){
                $path = public_path().'/'.str_replace('public','storage',$request->previousFilePath);

                if(File::exists($path)){
                    File::delete($path);
                }
            }

            $fileUpload = $this->uploadFile($file);

            $file = Files::where('path','=',$request->previousFilePath)->get()->first();
            if($file){
                $file->update([
                    'path'=> $fileUpload['path'],
                    'name'=>$fileUpload['name']
                ]);
            }else{
                $file = Files::create([
                    'path'=> $fileUpload['path'],
                    'name'=>$fileUpload['name'],
                ]);
            }
            return response()->json([
                "success" => true,
                "message" => "File successfully uploaded",
                "file" => [
                    'path'=> $fileUpload['path'],
                    'name'=>$fileUpload['name']
                ]
            ]);
         }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function uploadFile($file){
            $lastFileId = Files::where('id','!=',0)->orderBy('id','desc')->first();
            if($lastFileId == null){
                $lastFileId = 0;
            }else{
                $lastFileId = $lastFileId->id;
            }
            $fileName = $file->getClientOriginalName();
            $ext = pathinfo($fileName, PATHINFO_EXTENSION);
            $fileName = md5($lastFileId.'_'.$fileName).'.'.$ext;

            $destinationPath = public_path().'/storage/files';
            $file->move($destinationPath,$fileName);
            $newPath = 'public/files/'.$fileName;
            return ['name'=>$file->getClientOriginalName(), 'path'=>$newPath];
    }
}
