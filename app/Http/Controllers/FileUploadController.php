<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Files;

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

            $path = $file->store('public/files');
            $name = $file->getClientOriginalName();

            Files::create([
                'path'=> $path,
                'name'=>$name,
            ]);

            return response()->json([
                "success" => true,
                "message" => "File successfully uploaded",
                "file" => [
                    'path'=> $path,
                    'name'=>$name
                ]
            ]);

        }
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
    public function update(Request $request, $id)
    {
        //
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
}