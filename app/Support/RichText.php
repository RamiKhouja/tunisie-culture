<?php

namespace App\Support;

class RichText
{
    public static function clean(string $html): string
    {
        // Formatting only: no attributes, links, embeds, scripts or event handlers.
        $html = strip_tags($html, '<p><br><strong><b><em><i><u><ul><ol><li><h2><h3><blockquote>');

        return preg_replace('/<(p|br|strong|b|em|i|u|ul|ol|li|h2|h3|blockquote)\b[^>]*>/i', '<$1>', $html);
    }
}
