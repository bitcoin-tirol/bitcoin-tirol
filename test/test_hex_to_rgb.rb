require 'minitest/autorun'
require 'liquid'
require_relative '../_plugins/hex_to_rgb'

class HexToRGBTest < Minitest::Test
  def setup
    @filter = Object.new.extend(Jekyll::HexToRGB)
  end

  def test_even_length
    assert_equal [170, 187, 204], @filter.hex_to_rgb('aabbcc')
  end

  def test_odd_length
    assert_equal [170, 187, 204], @filter.hex_to_rgb('abc')
  end
end
