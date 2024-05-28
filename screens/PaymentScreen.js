// screens/PaymentScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import RNPickerSelect from 'react-native-picker-select';

export default function PaymentScreen({ route }) {
  const { plan } = route.params;
  const { confirmPayment } = useStripe();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [installments, setInstallments] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});

  const planDetails = {
    mensal: { label: 'Mensal', price: 'R$ 100' },
    anual: { label: 'Anual', price: 'R$ 50' },
  };



  const handlePayment = async () => {
    try {
      const response = await fetch('http://localhost:3000/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan, installments }),
      });

      const { clientSecret } = await response.json();

      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        type: 'Card',
        billingDetails: {
          name,
          email,
          phone
        },
        paymentMethodOptions: {
          card: {
            installments: {
              enabled: true,
              plan: {
                count: installments,
                interval: 'month',
              },
            },
          },
        },
      });

      if (error) {
        console.log('Payment confirmation error', error);
      } else if (paymentIntent) {
        console.log('Payment successful', paymentIntent);
        alert('Pagamento realizado com sucesso!');
      }
    } catch (error) {
      console.log('Payment error', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {/* Summary of the selected plan */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>Resumo do Pedido:</Text>
          <Text>{`Plano: ${planDetails[plan].label}`}</Text>
          <Text>{`Preço: ${planDetails[plan].price}`}</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Número de telefone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
        />
        <CardField
          postalCodeEnabled={false}
          placeholder={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={styles.card}
          style={styles.cardContainer}
        />
        <Button title="Pagar" onPress={handlePayment} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
  },
  cardContainer: {
    height: 50,
    width: '100%',
    marginBottom: 30,
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  installmentsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 10,
    width: '100%',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginBottom: 10,
    width: '100%',
  },
});

 
