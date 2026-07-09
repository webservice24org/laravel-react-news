<?php

namespace App\Services;

use Mpdf\Mpdf;

class PdfService
{
    public static function make(): Mpdf
    {
        $defaultConfig = (new \Mpdf\Config\ConfigVariables())->getDefaults();

        $fontDirs = $defaultConfig['fontDir'];

        $fontConfig = (new \Mpdf\Config\FontVariables())->getDefaults();

        $fontData = $fontConfig['fontdata'];

        return new Mpdf([

            'mode' => 'utf-8',

            'format' => 'A4',

            'orientation' => 'P',

            'margin_left' => 15,

            'margin_right' => 15,

            'margin_top' => 18,

            'margin_bottom' => 18,

            'margin_header' => 8,

            'margin_footer' => 8,

            'fontDir' => array_merge(
                $fontDirs,
                [
                    storage_path('fonts'),
                ]
            ),

            'fontdata' => $fontData + [

                'notobengali' => [
                    'R' => 'NotoSansBengali-Regular.ttf',
                ],

            ],

            'default_font' => 'notobengali',

        ]);
    }
}