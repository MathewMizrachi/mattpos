
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

interface PinPadProps {
  onSubmit: (pin: string) => void;
  title: string;
  subtitle: string;
}

const PinPad: React.FC<PinPadProps> = ({ onSubmit, title, subtitle }) => {
  const [pin, setPin] = useState('');
  const maxLength = 4;

  const handlePress = (number: string) => {
    if (pin.length < maxLength) {
      setPin(prevPin => prevPin + number);
    }
  };

  const handleDelete = () => {
    setPin(prevPin => prevPin.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  const handleSubmit = () => {
    if (pin.length === maxLength) {
      onSubmit(pin);
    }
  };

  const renderDots = () => {
    const dots = [];
    for (let i = 0; i < maxLength; i++) {
      dots.push(
        <View
          key={i}
          style={[
            styles.dot,
            pin.length > i ? styles.dotFilled : styles.dotEmpty,
          ]}
        />
      );
    }
    return dots;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.dotsContainer}>{renderDots()}</View>

      <View style={styles.keypadContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
          <TouchableOpacity
            key={number}
            style={styles.keypadButton}
            onPress={() => handlePress(number.toString())}
          >
            <Text style={styles.keypadButtonText}>{number}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.keypadButton} onPress={handleClear}>
          <Text style={styles.keypadButtonText}>C</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.keypadButton}
          onPress={() => handlePress('0')}
        >
          <Text style={styles.keypadButtonText}>0</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.keypadButton} onPress={handleDelete}>
          <Text style={styles.keypadButtonText}>⌫</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          pin.length !== maxLength && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={pin.length !== maxLength}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const width = Dimensions.get('window').width;
const buttonSize = (width - 80) / 3;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  dotEmpty: {
    backgroundColor: '#e5e7eb',
  },
  dotFilled: {
    backgroundColor: '#3b82f6',
  },
  keypadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  keypadButton: {
    width: buttonSize,
    height: buttonSize,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  keypadButtonText: {
    fontSize: 24,
    fontWeight: '500',
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default PinPad;
